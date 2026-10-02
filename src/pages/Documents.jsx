import { useState, useEffect, useRef } from 'react';
import DocumentCard from '../components/DocumentCard';
import LedgerTable from '../components/LedgerTable';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { createGenesisBlock, registerDocument, verifyDocument } from '../utils/blockchainUtils';

const ACCEPTED_TYPES = '.pdf,.docx,.txt,.png,.jpg,.jpeg';

// Documents page. Three things live here:
//   1. The documents themselves (owned by App.jsx, passed in as props)
//      — this is metadata only: name, type, upload date, hash, etc.
//   2. The integrity ledger — a locally-persisted chain of blocks.
//   3. `sessionFiles` — the ACTUAL File objects for anything uploaded
//      through the file picker this session. Browsers won't let us
//      persist real file bytes into localStorage, so this lives in
//      plain component state: real, usable while the tab is open,
//      but gone on refresh. That's why every uploaded document is
//      tagged `source: 'upload'` — so we always know whether we
//      should still have its real bytes around or not.
function Documents({ documents, onUpload, onUpdateDocument }) {
  const [search, setSearch] = useState('');
  const [ledger, setLedger] = useLocalStorage('intellihub_ledger', null);
  const [verifyResults, setVerifyResults] = useState({});
  const [verifyingId, setVerifyingId] = useState(null);
  const [sessionFiles, setSessionFiles] = useState({}); // { [documentId]: File }

  const fileInputRef = useRef(null);
  const registeringRef = useRef(false);

  // Every chain needs a starting block. Create it once, the first
  // time this page ever loads (ledger starts as `null`).
  useEffect(() => {
    if (ledger === null) {
      createGenesisBlock().then((genesis) => setLedger([genesis]));
    }
  }, [ledger, setLedger]);

  // Auto-register any document that doesn't have a hash yet — this
  // covers both the seed sample documents on first load, and any new
  // document added through the Upload button. If we still have the
  // real File object for it in `sessionFiles`, its ACTUAL bytes get
  // hashed; otherwise (the seed data) we fall back to a metadata hash.
  useEffect(() => {
    if (!ledger || registeringRef.current) return;
    const unregistered = documents.filter((d) => !d.documentHash);
    if (unregistered.length === 0) return;

    registeringRef.current = true;
    (async () => {
      let chain = ledger;
      for (const doc of unregistered) {
        const previousBlock = chain[chain.length - 1];
        const file = sessionFiles[doc.id] || null;
        const block = await registerDocument(doc, previousBlock, file);
        chain = [...chain, block];
        onUpdateDocument(doc.id, { documentHash: block.documentHash, blockIndex: block.index });
      }
      setLedger(chain);
      registeringRef.current = false;
    })();
  }, [documents, ledger, sessionFiles, onUpdateDocument, setLedger]);

  const visibleDocs = documents.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  // Fires when the user picks file(s) in the native browser dialog.
  // `e.target.files` is a FileList (array-like, not a real array) —
  // Array.from() converts it so we can use normal array methods on it.
  function handleFileSelected(e) {
    const files = Array.from(e.target.files || []);

    files.forEach((file) => {
      const id = `d${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const ext = file.name.includes('.') ? file.name.split('.').pop().toUpperCase() : 'FILE';

      // Keep the real File object in memory, keyed by the new
      // document's id, so registration (and later, verification)
      // can hash its actual bytes.
      setSessionFiles((prev) => ({ ...prev, [id]: file }));

      onUpload({
        id,
        name: file.name,
        type: ext,
        uploadDate: new Date().toISOString().slice(0, 10),
        documentHash: null,
        blockIndex: null,
        source: 'upload',
      });
    });

    e.target.value = ''; // reset so selecting the same file again still fires onChange
  }

  // Re-derives the document's hash and this block's hash from the
  // document's CURRENT data, then compares them against what the
  // ledger stored at registration time. For a real upload, this only
  // works while we still hold its File object in `sessionFiles` — if
  // the page has been refreshed since, we say so honestly instead of
  // silently falling back to a metadata-only check.
  async function handleVerify(doc) {
    if (!ledger || doc.blockIndex == null) return;
    const file = sessionFiles[doc.id] || null;

    if (doc.source === 'upload' && !file) {
      setVerifyResults((prev) => ({ ...prev, [doc.id]: { valid: null, unavailable: true } }));
      return;
    }

    const block = ledger[doc.blockIndex];
    const previousBlock = ledger[doc.blockIndex - 1] || null;

    setVerifyingId(doc.id);
    const result = await verifyDocument(doc, block, previousBlock, file);
    setVerifyResults((prev) => ({ ...prev, [doc.id]: result }));
    setVerifyingId(null);
  }

  // Demo-only action: mutates the document's name WITHOUT touching
  // the ledger, so "Verify Integrity" afterwards will recompute a
  // different block hash than the one stored at registration —
  // exactly the kind of tampering this ledger is meant to catch.
  function handleTamper(doc) {
    const alreadyTampered = doc.name.endsWith(' (tampered)');
    onUpdateDocument(doc.id, {
      name: alreadyTampered ? doc.name : `${doc.name} (tampered)`,
    });
    setVerifyResults((prev) => {
      const next = { ...prev };
      delete next[doc.id];
      return next;
    });
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-header__eyebrow">Document management</div>
          <h1>Documents</h1>
          <div className="page-header__sub">
            {documents.length} files · {ledger ? ledger.length - 1 : 0} registered on the integrity ledger
          </div>
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            accept={ACCEPTED_TYPES}
            multiple
            style={{ display: 'none' }}
            onChange={handleFileSelected}
          />
          <button className="btn btn--primary" onClick={openFilePicker}>
            + Upload document
          </button>
        </div>
      </div>

      <div className="task-toolbar">
        <div className="task-search">
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {visibleDocs.length === 0 ? (
        <div className="card empty-state">No documents match your search.</div>
      ) : (
        <div className="doc-grid">
          {visibleDocs.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              verifyResult={verifyResults[doc.id]}
              verifying={verifyingId === doc.id}
              onVerify={handleVerify}
              onTamper={handleTamper}
            />
          ))}
        </div>
      )}

      <div className="card" style={{ padding: 22, marginTop: 24 }}>
        <div className="section-title">Integrity ledger</div>
        <div className="page-header__sub" style={{ marginBottom: 16 }}>
          Every registered document gets one block. Each block's hash is derived partly from
          the block before it — changing a document after registration changes its hash and
          breaks that link, which "Verify Integrity" detects.
        </div>
        {ledger ? <LedgerTable ledger={ledger} /> : <div className="empty-state">Building ledger…</div>}
      </div>

      <div className="card" style={{ padding: 22, marginTop: 20 }}>
        <div className="section-title">How IntelliHub protects document integrity</div>
        <div className="integrity-flow">
          <div className="integrity-flow__step">
            <strong>Document</strong>
            <span>Real file bytes (or sample metadata)</span>
          </div>
          <span className="integrity-flow__arrow">→</span>
          <div className="integrity-flow__step">
            <strong>SHA-256 Hash</strong>
            <span>Web Crypto API, in-browser</span>
          </div>
          <span className="integrity-flow__arrow">→</span>
          <div className="integrity-flow__step">
            <strong>Ledger Block</strong>
            <span>Index, timestamp, doc hash</span>
          </div>
          <span className="integrity-flow__arrow">→</span>
          <div className="integrity-flow__step">
            <strong>Chained Hash</strong>
            <span>Linked to previous block</span>
          </div>
          <span className="integrity-flow__arrow">→</span>
          <div className="integrity-flow__step">
            <strong>Verification</strong>
            <span>Recompute & compare</span>
          </div>
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-ink-soft)', marginTop: 16, lineHeight: 1.6 }}>
          This is a blockchain-inspired, tamper-evident ledger prototype, not a decentralized
          blockchain — there's no peer-to-peer network or mining involved. Uploaded files are
          hashed from their real bytes using the browser's Web Crypto API; that hash and the
          ledger metadata persist in localStorage, but the file's raw bytes only live in this
          browser tab for the current session — refreshing means re-uploading to verify against
          the original file again.
        </p>
      </div>
    </>
  );
}

export default Documents;
