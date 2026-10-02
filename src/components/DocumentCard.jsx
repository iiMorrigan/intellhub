import { formatDate } from '../utils/taskUtils';
import { truncateHash } from '../utils/blockchainUtils';

// A document can be in a few states here:
//   1. Not yet registered on the ledger (documentHash is null)
//   2. Registered, not yet (re-)verified this session
//   3. Registered AND just verified — verifyResult.valid is true/false
//   4. A real upload whose original file isn't available this
//      session (e.g. after a refresh) — verifyResult.unavailable
//
// DocumentCard doesn't know HOW hashing or verification works — it
// just displays whatever state it's given and calls onVerify/onTamper
// when the buttons are clicked. All the actual crypto logic lives in
// blockchainUtils.js and is triggered from Documents.jsx.
function DocumentCard({ document, verifyResult, verifying, onVerify, onTamper }) {
  const isRegistered = Boolean(document.documentHash);
  const isRealUpload = document.source === 'upload';

  return (
    <div className="card doc-card">
      <div className="doc-card__icon">{document.type}</div>
      <div>
        <div className="doc-card__name">{document.name}</div>
        <div className="doc-card__meta">Uploaded {formatDate(document.uploadDate)}</div>
      </div>

      <span className={`badge ${isRegistered ? 'badge--success' : 'badge--medium'}`}>
        {isRegistered ? `On ledger · Block #${document.blockIndex}` : 'Registering…'}
      </span>

      {isRegistered && (
        <div className="doc-card__hash">
          <span className="doc-card__hash-label">Document hash</span>
          <code>{truncateHash(document.documentHash)}</code>
          <span className="doc-card__hash-note">
            {isRealUpload ? 'Hashed from the actual file bytes' : 'Hashed from metadata (sample document)'}
          </span>
        </div>
      )}

      {verifyResult && (
        verifyResult.unavailable ? (
          <div className="verify-result verify-result--info">
            Original file not available this session — re-upload to verify.
          </div>
        ) : (
          <div className={`verify-result ${verifyResult.valid ? 'verify-result--pass' : 'verify-result--fail'}`}>
            {verifyResult.valid ? 'Integrity Verified' : 'Integrity Check Failed'}
          </div>
        )
      )}

      {isRegistered && (
        <div className="doc-card__actions">
          <button className="btn btn--ghost btn--sm" onClick={() => onVerify(document)} disabled={verifying}>
            {verifying ? 'Verifying…' : 'Verify Integrity'}
          </button>
          <button className="btn btn--ghost btn--sm doc-card__tamper" onClick={() => onTamper(document)}>
            Simulate Tamper
          </button>
        </div>
      )}
    </div>
  );
}

export default DocumentCard;
