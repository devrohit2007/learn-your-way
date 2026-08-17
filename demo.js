// demo.js — Built-in demo content for "What is a pointer in C?"
// This works entirely without an API key.

const DEMO_MATERIAL = `A pointer is a variable that stores the memory address of another variable. In C, pointers are declared using the * operator and the address of a variable can be obtained using the & operator.`;

const DEMO_EXPLANATIONS = {
  simple: {
    type: 'text',
    content: `<p>A pointer is a special kind of variable — but instead of storing a number or a word, it stores a <em>location</em>.</p>
<p>Think of it this way: your computer's memory is like a long street of numbered houses. A normal variable <strong>lives in one of those houses</strong>. A pointer is a variable that <strong>holds the house number</strong> of another variable.</p>
<p>In C, you create a pointer with <code>*</code> and you get a variable's address with <code>&</code>. That's all it is — a way to remember <em>where</em> something is stored, not what it is.</p>`
  },

  analogy: {
    type: 'text',
    content: `<p>Imagine you have a notebook where you write down important information — that's a <strong>variable</strong>. Now imagine a separate piece of paper where you write down <em>which page</em> the information is on — that's a <strong>pointer</strong>.</p>
<p>The pointer doesn't contain the information itself. It just tells you <em>where to find it</em>. If someone asks you "what's on page 7?", you look at the page the pointer directed you to.</p>
<p>In C, the <code>&</code> operator is like writing down the page number. The <code>*</code> operator is like opening the notebook to that page and reading what's there.</p>`
  },

  visual: {
    type: 'visual',
    content: `
      <div class="ai-diagram">
        <div class="ai-diagram-box">
          <strong>Variable</strong> &nbsp;<code>int x = 42</code>
        </div>
        <div class="ai-diagram-arrow">↓ &nbsp;stored at memory address</div>
        <div class="ai-diagram-box" style="border-style: dashed;">
          <strong>Memory location</strong> &nbsp;<code>0x7ffd5c</code>
        </div>
        <div class="ai-diagram-arrow">↑ &nbsp;this address is stored in</div>
        <div class="ai-diagram-box">
          <strong>Pointer</strong> &nbsp;<code>int *ptr = &amp;x</code>
        </div>
        <div class="ai-diagram-arrow">↓ &nbsp;to read the value, use</div>
        <div class="ai-diagram-box" style="border-color: var(--text-tertiary);">
          <strong>Dereference</strong> &nbsp;<code>*ptr → 42</code>
        </div>
      </div>
      <p>The pointer <code>ptr</code> doesn't hold <code>42</code>. It holds the address where <code>42</code> lives. Using <code>*ptr</code> follows that address and retrieves the value.</p>
    `
  },

  steps: {
    type: 'steps',
    content: [
      `Create a variable: <code>int x = 42;</code> — now <code>x</code> lives somewhere in memory.`,
      `Every memory location has a unique address. Get <code>x</code>'s address with <code>&x</code>.`,
      `Create a pointer to hold that address: <code>int *ptr = &x;</code>`,
      `Now <code>ptr</code> contains the address of <code>x</code> — not the value 42, just the location.`,
      `To read the value through the pointer, use <code>*ptr</code> — this is called dereferencing.`,
      `<code>*ptr</code> gives you <code>42</code>, the same as <code>x</code>.`
    ]
  }
};

const DEMO_PRACTICE = [
  {
    type: 'mc',
    question: 'What does a pointer store?',
    options: [
      'The value of another variable',
      'The memory address of another variable',
      'A copy of another variable',
      'The name of another variable'
    ],
    correct: 1,
    explanation: 'A pointer stores a memory address — the location of another variable, not the value itself.'
  },
  {
    type: 'mc',
    question: 'In C, which operator gives you the memory address of a variable?',
    options: ['*', '#', '&', '@'],
    correct: 2,
    explanation: 'The & (address-of) operator returns the memory address of a variable.'
  },
  {
    type: 'mc',
    question: 'If ptr is a pointer to x, what does *ptr give you?',
    options: [
      'The address of ptr',
      'The address of x',
      'The value stored in x',
      'Nothing — this is invalid'
    ],
    correct: 2,
    explanation: 'The * operator dereferences the pointer — it follows the address and retrieves the actual value stored there.'
  }
];


const DEMO_QUIZ = [
  {
    question: 'Which of the following correctly declares a pointer to an integer in C?',
    options: ['int ptr;', 'int &ptr;', 'int *ptr;', 'pointer int ptr;'],
    correct: 2,
    explanation: 'In C, the * symbol before the variable name declares it as a pointer. So int *ptr; declares a pointer to an integer.'
  },
  {
    question: 'What happens when you dereference a NULL pointer?',
    options: ['You get the value 0', 'You get an empty string', 'The program crashes or causes undefined behaviour', 'You get the address 0x0000'],
    correct: 2,
    explanation: 'Dereferencing a NULL pointer means trying to access memory at address 0, which is not valid. This causes a segmentation fault or undefined behaviour.'
  },
  {
    question: 'If int x = 10 and int *ptr = &x, what is the value of *ptr?',
    options: ['The address of x', '10', '&x', 'ptr'],
    correct: 1,
    explanation: '*ptr dereferences the pointer, which means go to the address stored in ptr and read what is there. Since ptr holds the address of x, *ptr gives you x value: 10.'
  },
  {
    question: 'What does the & operator do when used with a variable?',
    options: ['It doubles the variable value', 'It returns the variable memory address', 'It creates a copy of the variable', 'It deletes the variable from memory'],
    correct: 1,
    explanation: 'The & address-of operator returns the memory address where a variable is stored, not its value.'
  }
];
