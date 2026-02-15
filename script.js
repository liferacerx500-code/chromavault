// Mock Data
const tokens = [
  {
    id: 1,
    symbol: 'ETH',
    name: 'Ethereum',
    chain: 'ethereum',
    balance: 12.4582,
    price: 3421.85,
    change24h: 5.23,
    icon: '⟠',
    color: '#627eea'
  },
  {
    id: 2,
    symbol: 'SOL',
    name: 'Solana',
    chain: 'solana',
    balance: 245.67,
    price: 142.33,
    change24h: -2.15,
    icon: '◎',
    color: '#14f195'
  },
  {
    id: 3,
    symbol: 'BNB',
    name: 'BNB',
    chain: 'bsc',
    balance: 34.21,
    price: 625.42,
    change24h: 3.48,
    icon: '◆',
    color: '#f3ba2f'
  },
  {
    id: 4,
    symbol: 'USDC',
    name: 'USD Coin',
    chain: 'ethereum',
    balance: 15420.50,
    price: 1.00,
    change24h: 0.02,
    icon: '$',
    color: '#2775ca'
  },
  {
    id: 5,
    symbol: 'LINK',
    name: 'Chainlink',
    chain: 'ethereum',
    balance: 892.14,
    price: 18.74,
    change24h: 8.92,
    icon: '⬡',
    color: '#375bd2'
  },
  {
    id: 6,
    symbol: 'MATIC',
    name: 'Polygon',
    chain: 'ethereum',
    balance: 4523.88,
    price: 1.15,
    change24h: -1.23,
    icon: '⬢',
    color: '#8247e5'
  }
];

const transactions = [
  {
    id: 1,
    type: 'receive',
    token: 'ETH',
    amount: 2.5,
    from: '0x8f3a...bc12',
    to: '0x7f3d...a21c',
    time: '2 hours ago',
    chain: 'ethereum'
  },
  {
    id: 2,
    type: 'send',
    token: 'SOL',
    amount: 50.0,
    from: '0x7f3d...a21c',
    to: '0x2a1f...7d3e',
    time: '5 hours ago',
    chain: 'solana'
  },
  {
    id: 3,
    type: 'receive',
    token: 'USDC',
    amount: 5000.0,
    from: '0x4e2b...9c45',
    to: '0x7f3d...a21c',
    time: '1 day ago',
    chain: 'ethereum'
  },
  {
    id: 4,
    type: 'send',
    token: 'BNB',
    amount: 5.2,
    from: '0x7f3d...a21c',
    to: '0x9b4c...1a8f',
    time: '2 days ago',
    chain: 'bsc'
  },
  {
    id: 5,
    type: 'receive',
    token: 'LINK',
    amount: 120.5,
    from: '0x5c8e...4f21',
    to: '0x7f3d...a21c',
    time: '3 days ago',
    chain: 'ethereum'
  },
  {
    id: 6,
    type: 'send',
    token: 'MATIC',
    amount: 800.0,
    from: '0x7f3d...a21c',
    to: '0x3d7a...6e9b',
    time: '4 days ago',
    chain: 'ethereum'
  }
];

let currentChain = 'all';

// Count-up animation for portfolio value
function animateValue(element, start, end, duration) {
  const startTime = performance.now();
  const startValue = parseFloat(start);
  const endValue = parseFloat(end);
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = startValue + (endValue - startValue) * easeOutQuart;
    
    element.textContent = '$' + current.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

// Initialize count-up
document.addEventListener('DOMContentLoaded', () => {
  const countUpElement = document.querySelector('.count-up');
  const targetValue = countUpElement.getAttribute('data-target');
  animateValue(countUpElement, 0, targetValue, 2000);
});

// Render donut chart
function renderAllocationChart() {
  const canvas = document.getElementById('allocationChart');
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 80;
  const innerRadius = 50;
  
  // Calculate total value and percentages
  const tokenValues = tokens.map(token => ({
    ...token,
    value: token.balance * token.price,
    percentage: 0
  }));
  
  const totalValue = tokenValues.reduce((sum, token) => sum + token.value, 0);
  tokenValues.forEach(token => {
    token.percentage = (token.value / totalValue) * 100;
  });
  
  // Sort by value descending
  tokenValues.sort((a, b) => b.value - a.value);
  
  // Draw donut segments
  let currentAngle = -Math.PI / 2;
  
  tokenValues.forEach((token, index) => {
    const sliceAngle = (token.percentage / 100) * 2 * Math.PI;
    
    // Outer arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
    ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
    ctx.closePath();
    
    // Gradient fill
    const gradient = ctx.createLinearGradient(
      centerX - radius, centerY - radius,
      centerX + radius, centerY + radius
    );
    
    const colors = [
      ['#fbbf24', '#f59e0b'],
      ['#8b5cf6', '#7c3aed'],
      ['#06b6d4', '#0891b2'],
      ['#10b981', '#059669'],
      ['#f43f5e', '#e11d48'],
      ['#6366f1', '#4f46e5']
    ];
    
    const colorPair = colors[index % colors.length];
    gradient.addColorStop(0, colorPair[0]);
    gradient.addColorStop(1, colorPair[1]);
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    currentAngle += sliceAngle;
  });
  
  // Draw center circle (glass effect)
  ctx.beginPath();
  ctx.arc(centerX, centerY, innerRadius - 2, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(10, 10, 15, 0.9)';
  ctx.fill();
  
  // Draw center text
  ctx.fillStyle = '#e4e4e7';
  ctx.font = 'bold 14px Space Grotesk';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(tokenValues.length, centerX, centerY - 8);
  ctx.font = '11px Space Grotesk';
  ctx.fillStyle = '#71717a';
  ctx.fillText('Assets', centerX, centerY + 8);
}

// Render token table
function renderTokenTable() {
  const tbody = document.getElementById('tokenTableBody');
  const filteredTokens = currentChain === 'all' 
    ? tokens 
    : tokens.filter(t => t.chain === currentChain);
  
  tbody.innerHTML = filteredTokens.map(token => {
    const value = token.balance * token.price;
    const changeClass = token.change24h >= 0 ? 'positive' : 'negative';
    const changeSymbol = token.change24h >= 0 ? '+' : '';
    
    return `
      <tr class="token-row transition-all duration-200">
        <td class="px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-2xl" style="background: linear-gradient(135deg, ${token.color}22, ${token.color}11);">
              ${token.icon}
            </div>
            <div>
              <p class="font-semibold">${token.symbol}</p>
              <p class="text-sm text-zinc-500">${token.name}</p>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 text-right mono font-medium">${token.balance.toLocaleString('en-US', { minimumFractionDigits: 4 })}</td>
        <td class="px-6 py-4 text-right mono">$${token.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
        <td class="px-6 py-4 text-right">
          <span class="font-semibold ${changeClass}">${changeSymbol}${token.change24h.toFixed(2)}%</span>
        </td>
        <td class="px-6 py-4 text-right font-bold">$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
      </tr>
    `;
  }).join('');
}

// Render transactions
function renderTransactions() {
  const container = document.getElementById('transactionList');
  const filteredTxs = currentChain === 'all'
    ? transactions
    : transactions.filter(tx => tx.chain === currentChain);
  
  container.innerHTML = filteredTxs.map(tx => {
    const badgeClass = tx.type === 'send' ? 'badge-send' : 'badge-receive';
    const arrow = tx.type === 'send' ? '↑' : '↓';
    const typeLabel = tx.type === 'send' ? 'Send' : 'Receive';
    
    return `
      <div class="tx-row p-6 transition-all duration-200">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4 flex-1">
            <div class="w-10 h-10 rounded-full ${badgeClass} flex items-center justify-center text-xl font-bold">
              ${arrow}
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-semibold">${typeLabel} ${tx.token}</span>
                <span class="px-2 py-0.5 rounded-full text-xs ${badgeClass}">${tx.chain}</span>
              </div>
              <p class="text-sm text-zinc-500 mono">
                ${tx.type === 'send' ? 'To:' : 'From:'} ${tx.type === 'send' ? tx.to : tx.from}
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-bold mono text-lg">${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} ${tx.token}</p>
            <p class="text-sm text-zinc-500">${tx.time}</p>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Chain filter buttons
document.querySelectorAll('[data-chain]').forEach(button => {
  button.addEventListener('click', () => {
    const chain = button.getAttribute('data-chain');
    currentChain = chain;
    
    // Update button states
    document.querySelectorAll('[data-chain]').forEach(btn => {
      btn.classList.remove('pill-active');
      btn.classList.add('pill-inactive');
    });
    button.classList.remove('pill-inactive');
    button.classList.add('pill-active');
    
    // Re-render filtered data
    renderTokenTable();
    renderTransactions();
  });
});

// Initialize
renderAllocationChart();
renderTokenTable();
renderTransactions();