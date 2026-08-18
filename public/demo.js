// demo.js — Thermodynamics demo (English / Hindi / Tamil) — no API needed

const DEMO_MATERIAL = `Thermodynamics is the branch of physics that studies the relationship between heat, work, and energy. The first law states that energy cannot be created or destroyed — it can only be converted from one form to another. The second law states that heat naturally flows from hot objects to cold ones, and that disorder (entropy) in a closed system always increases over time.`;

const DEMO_EXPLANATIONS = {
  English: {
    simple: {
      type: 'text',
      content: `<p>Thermodynamics is the study of <em>energy</em> — how it moves and changes form.</p>
<p>The <strong>First Law</strong> says energy never disappears. When you burn fuel, chemical energy becomes heat. The total amount stays the same — it just changes form.</p>
<p>The <strong>Second Law</strong> says heat always moves from hot to cold on its own. Things naturally move toward disorder over time — that tendency is called <strong>entropy</strong>.</p>`
    },
    analogy: {
      type: 'text',
      content: `<p>Think of energy like <strong>money</strong>. The First Law is like a strict accountant — no money appears from nowhere and none vanishes. It just moves around. Energy works the same way.</p>
<p>The Second Law is like your desk. Leave it alone and it gets messy on its own. It never tidies itself. To reduce the mess (entropy), you have to put in effort.</p>`
    },
    visual: {
      type: 'visual',
      content: `<div class="ai-diagram">
  <div class="ai-diagram-box"><strong>Chemical Energy</strong> (fuel or food)</div>
  <div class="ai-diagram-arrow">↓ First Law: energy converts, never disappears</div>
  <div class="ai-diagram-box"><strong>Heat Energy</strong> (released by burning)</div>
  <div class="ai-diagram-arrow">↓ Second Law: flows from hot to cold</div>
  <div class="ai-diagram-box"><strong>Useful Work</strong> (engine, motion)</div>
  <div class="ai-diagram-arrow">↓ some energy always lost to</div>
  <div class="ai-diagram-box" style="border-color:var(--text-tertiary)"><strong>Entropy</strong> (disorder increases)</div>
</div>
<p>No process is perfectly efficient — some energy always spreads out as disorder.</p>`
    },
    steps: {
      type: 'steps',
      content: [
        'Energy exists in many forms — chemical, heat, mechanical, electrical.',
        '<strong>First Law:</strong> energy is never created or destroyed, only converted from one form to another.',
        'When fuel burns, chemical energy converts into heat — the total amount is preserved.',
        '<strong>Second Law:</strong> heat always flows naturally from a hotter object to a cooler one.',
        'This flow of heat can do useful work — like powering a steam engine.',
        'Entropy (disorder) always increases in a closed system over time.'
      ]
    }
  },
  Hindi: {
    simple: {
      type: 'text',
      content: `<p>ऊष्मागतिकी भौतिकी की वह शाखा है जो <em>ऊर्जा</em> का अध्ययन करती है।</p>
<p><strong>पहला नियम</strong> कहता है कि ऊर्जा कभी नष्ट नहीं होती। जब ईंधन जलता है, रासायनिक ऊर्जा गर्मी में बदल जाती है। कुल मात्रा वही रहती है।</p>
<p><strong>दूसरा नियम</strong> कहता है कि गर्मी हमेशा गर्म से ठंडे की तरफ बहती है। चीजें समय के साथ अव्यवस्था की तरफ बढ़ती हैं — इसे <strong>एन्ट्रापी</strong> कहते हैं।</p>`
    },
    analogy: {
      type: 'text',
      content: `<p>ऊर्जा को <strong>पैसे</strong> की तरह सोचें। पहला नियम एक सख्त हिसाब-किताब वाले की तरह है — पैसा कहीं से नहीं आता और कहीं जाता नहीं। बस एक जगह से दूसरी जगह जाता है।</p>
<p>दूसरा नियम आपकी मेज की तरह है। उसे अकेला छोड़ दो तो वह गंदी हो जाएगी। अव्यवस्था कम करने के लिए मेहनत लगती है।</p>`
    },
    visual: {
      type: 'visual',
      content: `<div class="ai-diagram">
  <div class="ai-diagram-box"><strong>रासायनिक ऊर्जा</strong> (ईंधन या भोजन)</div>
  <div class="ai-diagram-arrow">↓ पहला नियम: ऊर्जा बदलती है, नष्ट नहीं होती</div>
  <div class="ai-diagram-box"><strong>गर्मी ऊर्जा</strong> (जलने से निकलती है)</div>
  <div class="ai-diagram-arrow">↓ दूसरा नियम: गर्म से ठंडे की तरफ बहती है</div>
  <div class="ai-diagram-box"><strong>उपयोगी कार्य</strong> (इंजन, गति)</div>
  <div class="ai-diagram-arrow">↓ कुछ ऊर्जा हमेशा जाती है</div>
  <div class="ai-diagram-box" style="border-color:var(--text-tertiary)"><strong>एन्ट्रापी</strong> (अव्यवस्था बढ़ती है)</div>
</div>
<p>कोई भी प्रक्रिया पूरी तरह कुशल नहीं होती।</p>`
    },
    steps: {
      type: 'steps',
      content: [
        'ऊर्जा कई रूपों में होती है — रासायनिक, गर्मी, यांत्रिक, विद्युत।',
        '<strong>पहला नियम:</strong> ऊर्जा न बनती है, न नष्ट होती है, केवल रूप बदलती है।',
        'जब ईंधन जलता है, रासायनिक ऊर्जा गर्मी में बदलती है।',
        '<strong>दूसरा नियम:</strong> गर्मी हमेशा गर्म से ठंडे की तरफ बहती है।',
        'यह गर्मी उपयोगी काम कर सकती है — जैसे भाप इंजन चलाना।',
        'एन्ट्रापी एक बंद तंत्र में हमेशा बढ़ती है।'
      ]
    }
  },
  Tamil: {
    simple: {
      type: 'text',
      content: `<p>வெப்பவியல் என்பது <em>ஆற்றல்</em> பற்றி ஆய்வு செய்யும் இயற்பியல் பிரிவு.</p>
<p><strong>முதல் விதி:</strong> ஆற்றல் ஒருபோதும் மறைவதில்லை. வடிவம் மட்டும் மாறும்.</p>
<p><strong>இரண்டாம் விதி:</strong> வெப்பம் சூடானதிலிருந்து குளிர்ந்ததுக்கு செல்லும். கோளாறு அதிகரிக்கும் — இதை <strong>என்ட்ரோபி</strong> என்கிறோம்.</p>`
    },
    analogy: {
      type: 'text',
      content: `<p>ஆற்றலை <strong>பணம்</strong> போல் நினைத்துக்கொள்ளுங்கள். முதல் விதி ஒரு கணக்காளரைப் போன்றது — பணம் எங்கிருந்தும் தோன்றாது, மறைந்துவிடாது.</p>
<p>இரண்டாம் விதி உங்கள் மேசையைப் போன்றது. அதை தனியாக விட்டால் தானாக ஒழுங்கற்றுப் போகும்.</p>`
    },
    visual: {
      type: 'visual',
      content: `<div class="ai-diagram">
  <div class="ai-diagram-box"><strong>வேதியியல் ஆற்றல்</strong> (எரிபொருள்)</div>
  <div class="ai-diagram-arrow">↓ முதல் விதி: ஆற்றல் மாறும், அழியாது</div>
  <div class="ai-diagram-box"><strong>வெப்ப ஆற்றல்</strong> (எரிவதால் வெளியாகும்)</div>
  <div class="ai-diagram-arrow">↓ இரண்டாம் விதி: சூட்டிலிருந்து குளிருக்கு</div>
  <div class="ai-diagram-box"><strong>பயனுள்ள வேலை</strong> (எஞ்சின்)</div>
  <div class="ai-diagram-arrow">↓ சில ஆற்றல் எப்போதும் போகும்</div>
  <div class="ai-diagram-box" style="border-color:var(--text-tertiary)"><strong>என்ட்ரோபி</strong> (கோளாறு அதிகரிக்கும்)</div>
</div>
<p>எந்த செயல்முறையும் முழுமையாக திறமையானது இல்லை.</p>`
    },
    steps: {
      type: 'steps',
      content: [
        'ஆற்றல் பல வடிவங்களில் உள்ளது — வேதியியல், வெப்பம், இயக்கவியல்.',
        '<strong>முதல் விதி:</strong> ஆற்றல் உருவாகவோ அழியவோ மாட்டாது, வடிவம் மட்டும் மாறும்.',
        'எரிபொருள் எரியும்போது வேதியியல் ஆற்றல் வெப்பமாக மாறுகிறது.',
        '<strong>இரண்டாம் விதி:</strong> வெப்பம் சூடானதிலிருந்து குளிர்ந்ததுக்கு செல்லும்.',
        'இந்த வெப்பம் பயனுள்ள வேலை செய்யலாம்.',
        'என்ட்ரோபி மூடிய அமைப்பில் எப்போதும் அதிகரிக்கும்.'
      ]
    }
  }
};

const DEMO_PRACTICE = {
  English: [
    { type: 'mc', question: 'What does the First Law of Thermodynamics state?', options: ['Energy can be created from nothing', 'Energy cannot be created or destroyed, only converted', 'Heat always flows from cold to hot', 'Entropy decreases over time'], correct: 1, explanation: 'The First Law is conservation of energy — it can change form but the total amount never changes.' },
    { type: 'mc', question: 'According to the Second Law, heat naturally flows:', options: ['From cold to hot', 'From hot to cold', 'In both directions equally', 'Only in a vacuum'], correct: 1, explanation: 'Heat always flows from hotter to cooler objects on its own.' },
    { type: 'mc', question: 'What is entropy?', options: ['The amount of heat in a system', 'The work done by a system', 'A measure of disorder in a system', 'The temperature difference between objects'], correct: 2, explanation: 'Entropy measures disorder. The Second Law says entropy always increases in a closed system.' }
  ],
  Hindi: [
    { type: 'mc', question: 'ऊष्मागतिकी का पहला नियम क्या कहता है?', options: ['ऊर्जा कहीं से भी बन सकती है', 'ऊर्जा न बनती है, न नष्ट होती है, केवल रूप बदलती है', 'गर्मी हमेशा ठंडे से गर्म की तरफ बहती है', 'एन्ट्रापी समय के साथ घटती है'], correct: 1, explanation: 'पहला नियम ऊर्जा संरक्षण का नियम है।' },
    { type: 'mc', question: 'दूसरे नियम के अनुसार, गर्मी स्वाभाविक रूप से कहाँ बहती है?', options: ['ठंडे से गर्म की तरफ', 'गर्म से ठंडे की तरफ', 'दोनों दिशाओं में', 'केवल निर्वात में'], correct: 1, explanation: 'गर्मी हमेशा गर्म से ठंडे की तरफ बहती है।' },
    { type: 'mc', question: 'एन्ट्रापी क्या है?', options: ['गर्मी की मात्रा', 'किया गया कार्य', 'अव्यवस्था का माप', 'तापमान का अंतर'], correct: 2, explanation: 'एन्ट्रापी अव्यवस्था को मापती है। बंद तंत्र में हमेशा बढ़ती है।' }
  ],
  Tamil: [
    { type: 'mc', question: 'வெப்பவியலின் முதல் விதி என்ன சொல்கிறது?', options: ['ஆற்றல் எங்கிருந்தும் உருவாகலாம்', 'ஆற்றல் உருவாகவோ அழியவோ மாட்டாது', 'வெப்பம் குளிரிலிருந்து சூட்டுக்கு செல்லும்', 'என்ட்ரோபி குறையும்'], correct: 1, explanation: 'முதல் விதி ஆற்றல் பாதுகாப்பு விதி.' },
    { type: 'mc', question: 'இரண்டாம் விதியின்படி வெப்பம் எங்கு செல்லும்?', options: ['குளிரிலிருந்து சூட்டுக்கு', 'சூட்டிலிருந்து குளிருக்கு', 'இரு திசைகளிலும்', 'வெற்றிடத்தில் மட்டும்'], correct: 1, explanation: 'வெப்பம் எப்போதும் சூடானதிலிருந்து குளிர்ந்ததுக்கு செல்லும்.' },
    { type: 'mc', question: 'என்ட்ரோபி என்றால் என்ன?', options: ['வெப்பத்தின் அளவு', 'செய்யும் வேலை', 'கோளாற்றின் அளவீடு', 'வெப்பநிலை வித்தியாசம்'], correct: 2, explanation: 'என்ட்ரோபி கோளாற்றை அளவிடுகிறது. மூடிய அமைப்பில் எப்போதும் அதிகரிக்கும்.' }
  ]
};

const DEMO_QUIZ = {
  English: [
    { question: 'A hot cup of tea placed in a cold room gradually cools down. Which law explains this?', options: ['First Law', 'Second Law', 'Newton First Law', 'Law of Conservation of Mass'], correct: 1, explanation: 'The Second Law states heat flows naturally from hot to cold.' },
    { question: 'A car engine burns fuel to move the car. Which law describes this?', options: ['Second Law', 'Law of Gravity', 'First Law', 'Ohm Law'], correct: 2, explanation: 'The First Law: chemical energy in fuel converts into mechanical energy.' },
    { question: 'Why cannot you build a machine that runs forever without energy input?', options: ['Machines break down', 'First Law forbids energy creation from nothing', 'Gravity pulls it down', 'Entropy only applies to gases'], correct: 1, explanation: 'The First Law says energy cannot be created from nothing.' },
    { question: 'What happens to entropy of a closed system over time?', options: ['Decreases', 'Stays the same', 'Increases', 'Becomes zero'], correct: 2, explanation: 'The Second Law: entropy in a closed system always increases.' }
  ],
  Hindi: [
    { question: 'ठंडे कमरे में गर्म चाय ठंडी होती है। कौन सा नियम इसे समझाता है?', options: ['पहला नियम', 'दूसरा नियम', 'न्यूटन का पहला नियम', 'द्रव्यमान संरक्षण'], correct: 1, explanation: 'दूसरा नियम: गर्मी हमेशा गर्म से ठंडे की तरफ बहती है।' },
    { question: 'कार का इंजन ईंधन जलाकर कार चलाता है। यह किस नियम का उदाहरण है?', options: ['दूसरा नियम', 'गुरुत्वाकर्षण', 'पहला नियम', 'ओम का नियम'], correct: 2, explanation: 'पहला नियम: रासायनिक ऊर्जा यांत्रिक ऊर्जा में बदलती है।' },
    { question: 'बिना ऊर्जा के हमेशा चलने वाली मशीन क्यों नहीं बना सकते?', options: ['मशीनें टूट जाती हैं', 'पहला नियम बिना स्रोत के ऊर्जा बनने से मना करता है', 'गुरुत्वाकर्षण खींचता है', 'एन्ट्रापी केवल गैसों पर'], correct: 1, explanation: 'पहला नियम: ऊर्जा कहीं से नहीं बनती।' },
    { question: 'बंद तंत्र में एन्ट्रापी समय के साथ क्या होती है?', options: ['घटती है', 'समान रहती है', 'बढ़ती है', 'शून्य हो जाती है'], correct: 2, explanation: 'दूसरा नियम: बंद तंत्र में एन्ट्रापी हमेशा बढ़ती है।' }
  ],
  Tamil: [
    { question: 'குளிர்ந்த அறையில் சூடான தேநீர் ஆறுகிறது. எந்த விதி விளக்குகிறது?', options: ['முதல் விதி', 'இரண்டாம் விதி', 'நியூட்டன் விதி', 'நிறை பாதுகாப்பு விதி'], correct: 1, explanation: 'இரண்டாம் விதி: வெப்பம் சூட்டிலிருந்து குளிருக்கு செல்லும்.' },
    { question: 'கார் எஞ்சின் எரிபொருளை எரித்து காரை இயக்குகிறது. எந்த விதி?', options: ['இரண்டாம் விதி', 'ஈர்ப்பு விதி', 'முதல் விதி', 'ஓம் விதி'], correct: 2, explanation: 'முதல் விதி: வேதியியல் ஆற்றல் இயக்க ஆற்றலாக மாறுகிறது.' },
    { question: 'ஆற்றல் இல்லாமல் என்றும் இயங்கும் இயந்திரம் ஏன் கட்ட முடியாது?', options: ['இயந்திரங்கள் உடைகின்றன', 'முதல் விதி மூலமின்றி ஆற்றல் உருவாக தடை செய்கிறது', 'ஈர்ப்பு இழுக்கிறது', 'என்ட்ரோபி வாயுக்களுக்கு மட்டும்'], correct: 1, explanation: 'முதல் விதி: ஆற்றல் எங்கிருந்தும் தோன்றாது.' },
    { question: 'மூடிய அமைப்பில் என்ட்ரோபி என்ன ஆகும்?', options: ['குறையும்', 'அதே நிலையில்', 'அதிகரிக்கும்', 'பூஜ்யமாகும்'], correct: 2, explanation: 'இரண்டாம் விதி: மூடிய அமைப்பில் என்ட்ரோபி எப்போதும் அதிகரிக்கும்.' }
  ]
};
