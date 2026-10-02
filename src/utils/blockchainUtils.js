// blockchainUtils.js
//
// A simplified, EDUCATIONAL blockchain-style ledger used to demonstrate
// document integrity. It borrows exactly one core blockchain idea:
// each block's hash is derived partly from the block before it, so
// changing any past block breaks the chain of hashes that follows it.
//
// What this IS: a tamper-evident hash chain, computed entirely in the
// browser with the Web Crypto API, persisted to localStorage.
// What this IS NOT: a decentralized blockchain. There is no network,
// no peer nodes, no mining/consensus, and no cryptocurrency. It's a
// single, local ledger — the "chain" part is just how each hash links
// to the one before it.

const GENESIS_HASH = '0'.repeat(64);

// ---- Hashing -----------------------------------------------------

// Wraps the browser's built-in Web Crypto API to SHA-256 hash a
// string and return it as a hex string. No external crypto library
// needed — every modern browser ships this natively.
export async function sha256(message) {
  const data = new TextEncoder().encode(message);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Builds a deterministic string representing a document's content,
// for cases with no real file behind them (the seed sample documents).
// Real uploads bypass this entirely and get hashed from their actual
// bytes via hashFile() below.
export function buildDocumentFingerprint(doc) {
  return `${doc.name}|${doc.type}|${doc.uploadDate}`;
}

export async function hashDocument(doc) {
  return sha256(buildDocumentFingerprint(doc));
}

// Hashes the ACTUAL bytes of a real File object (from an <input
// type="file">), using the same Web Crypto API. file.arrayBuffer()
// reads the file's raw contents into memory; we then hash those
// bytes directly — nothing about the filename or metadata is
// involved, only the file's real content.
export async function hashFile(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// A block's own hash is derived from everything that should be
// tamper-evident: its position in the chain, when it was added, which
// document it represents, that document's hash, and the previous
// block's hash. Changing any one of these changes the resulting hash,
// which is exactly what lets us detect tampering later.
export async function computeBlockHash({ index, timestamp, documentName, documentHash, previousHash }) {
  return sha256(`${index}|${timestamp}|${documentName}|${documentHash}|${previousHash}`);
}

// ---- Ledger construction ------------------------------------------

// The first block in every chain. It has no real document behind it —
// it just gives every real block something to chain onto.
export async function createGenesisBlock() {
  const base = {
    index: 0,
    timestamp: 'genesis',
    documentName: 'Genesis Block',
    documentHash: GENESIS_HASH,
    previousHash: GENESIS_HASH,
  };
  const hash = await computeBlockHash(base);
  return { ...base, hash };
}

// Registers a document onto the ledger: hashes its current content,
// chains it to the previous block, then computes this new block's
// own hash. If a real `file` (a File object from the file picker) is
// passed in, we hash its ACTUAL bytes with hashFile(). Otherwise —
// for the seed sample documents, which have no real file behind them
// — we fall back to hashing the metadata fingerprint.
export async function registerDocument(doc, previousBlock, file = null) {
  const documentHash = file ? await hashFile(file) : await hashDocument(doc);
  const base = {
    index: previousBlock.index + 1,
    timestamp: new Date().toISOString(),
    documentName: doc.name,
    documentHash,
    previousHash: previousBlock.hash,
    documentId: doc.id,
  };
  const hash = await computeBlockHash(base);
  return { ...base, hash };
}

// ---- Verification ---------------------------------------------------

// Re-derives everything from the document's CURRENT state and checks
// it against what was stored in the block at registration time.
// If a real `file` is passed in, its current bytes are re-hashed with
// hashFile() — the same way registerDocument() originally hashed it.
// If the file's content (or the document's name/metadata) has changed
// since registration, the recomputed hashes won't match, and this
// reports a failure.
export async function verifyDocument(doc, block, previousBlock, file = null) {
  const recomputedDocHash = file ? await hashFile(file) : await hashDocument(doc);
  const recomputedBlockHash = await computeBlockHash({
    index: block.index,
    timestamp: block.timestamp,
    documentName: doc.name,
    documentHash: recomputedDocHash,
    previousHash: block.previousHash,
  });

  const docHashMatches = recomputedDocHash === block.documentHash;
  const blockHashMatches = recomputedBlockHash === block.hash;
  const chainLinkMatches = previousBlock ? block.previousHash === previousBlock.hash : true;

  return {
    valid: docHashMatches && blockHashMatches && chainLinkMatches,
    docHashMatches,
    blockHashMatches,
    chainLinkMatches,
    recomputedDocHash,
    recomputedBlockHash,
    checkedAt: new Date().toISOString(),
  };
}

// A cheap, synchronous check (no re-hashing) of whether each block's
// `previousHash` actually matches the hash of the block before it —
// i.e. whether the chain links are still intact. Useful for a quick
// visual "is this chain broken anywhere?" indicator in the ledger view.
export function isChainLinked(ledger, index) {
  if (index === 0) return true;
  const block = ledger[index];
  const previous = ledger[index - 1];
  if (!block || !previous) return false;
  return block.previousHash === previous.hash;
}

export function truncateHash(hash) {
  if (!hash) return '—';
  return `${hash.slice(0, 10)}…${hash.slice(-8)}`;
}
