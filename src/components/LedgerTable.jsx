import { useState } from 'react';
import { truncateHash, isChainLinked } from '../utils/blockchainUtils';

// Renders every block in the ledger as a row. `ledger.map()` walks
// through the array the same way TaskList does for tasks — one row
// per block, in order, so you can visually see the chain grow.
function LedgerTable({ ledger }) {
  // Tracks which single block's full hash is currently expanded, so
  // we don't have to render every full 64-character hash at once.
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="ledger-table">
      <div className="ledger-row ledger-row--head">
        <span>Block</span>
        <span>Document</span>
        <span>Timestamp</span>
        <span>Document hash</span>
        <span>Previous hash</span>
        <span>Block hash</span>
        <span>Chain link</span>
      </div>

      {ledger.map((block, i) => {
        const linked = isChainLinked(ledger, i);
        const isExpanded = expandedId === block.index;
        return (
          <div className="ledger-row" key={block.index}>
            <span className="ledger-row__index">#{block.index}</span>
            <span>{block.documentName}</span>
            <span className="ledger-row__time">
              {block.timestamp === 'genesis' ? 'Genesis' : new Date(block.timestamp).toLocaleString()}
            </span>
            <code
              className="ledger-hash"
              onClick={() => setExpandedId(isExpanded ? null : block.index)}
              title="Click to expand"
            >
              {isExpanded ? block.documentHash : truncateHash(block.documentHash)}
            </code>
            <code className="ledger-hash">{truncateHash(block.previousHash)}</code>
            <code
              className="ledger-hash"
              onClick={() => setExpandedId(isExpanded ? null : block.index)}
              title="Click to expand"
            >
              {isExpanded ? block.hash : truncateHash(block.hash)}
            </code>
            <span className={`badge ${linked ? 'badge--success' : 'badge--high'}`}>
              {linked ? 'Linked' : 'Broken'}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default LedgerTable;
