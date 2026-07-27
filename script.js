// Mobile nav toggle
document.querySelector('.nav__toggle').addEventListener('click', function() {
  const navMenu = document.getElementById('navMenu');
  navMenu.classList.toggle('open');
  const expanded = navMenu.classList.contains('open');
  this.setAttribute('aria-expanded', expanded);
  if (expanded) navMenu.querySelector('a').focus();
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const id = this.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if(window.innerWidth < 980) {
        document.getElementById('navMenu').classList.remove('open');
        document.querySelector('.nav__toggle').setAttribute('aria-expanded','false');
      }
    }
  });
});

// Section fade-in on scroll
const observer = new window.IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    }
  });
},{ threshold: 0.11 });
document.querySelectorAll('.reveal').forEach(sec => observer.observe(sec));

// FAQ Accordion
document.querySelectorAll('.faq__q').forEach(btn => {
  btn.addEventListener('click', function() {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.faq__q').forEach(b=>{
      b.setAttribute('aria-expanded','false');b.nextElementSibling.setAttribute('aria-hidden','true');
    });
    if(!expanded) {
      this.setAttribute('aria-expanded','true');
      this.nextElementSibling.setAttribute('aria-hidden','false');
    }
  });
  btn.addEventListener('keydown', function(e){
    if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.click(); }
  });
});

// Appointment Booking Form Validation (inline feedback)
document.getElementById('appointmentForm').addEventListener('submit', function(e){
  e.preventDefault();
  let form = this;
  let feedback = document.getElementById('appointment-feedback');
  feedback.textContent = '';
  let valid = true;
  for(let input of form.querySelectorAll('input,select')) {
    if(!input.value) { valid = false; input.focus(); break; }
  }
  if(!valid) {
    feedback.textContent = 'Please fill in all required fields.';
    feedback.className = 'form-feedback error';
    return;
  }
  feedback.textContent = 'Booking request submitted! Our team will contact you soon.';
  feedback.className = 'form-feedback success';
  form.reset();
});

// Chatbot Widget
document.getElementById('chatbotToggle').addEventListener('click',function(){
  const panel = document.getElementById('chatbotPanel');
  panel.classList.add('open');
  panel.focus();
});
document.getElementById('chatbotClose').addEventListener('click',function(){
  document.getElementById('chatbotPanel').classList.remove('open');
  document.getElementById('chatbotToggle').focus();
});
document.getElementById('chatbotToggle').addEventListener('keydown', function(e) {
  if((e.key==='Enter'||e.key===' ') && !document.getElementById('chatbotPanel').classList.contains('open')) {
    e.preventDefault(); this.click();
  }
});
document.getElementById('chatbotPanel').addEventListener('keydown', function(e) {
  if(e.key==='Escape') {
    this.classList.remove('open');
    document.getElementById('chatbotToggle').focus();
  }
});
// Chatbot Message Logic
const chatbotMessages = document.getElementById('chatbotMessages');
function addChatMsg({text, sender}) {
  let msg = document.createElement('div');
  msg.className = 'chatbot__message chatbot__message--'+(sender==='user'?'user':'bot');
  msg.textContent = text;
  chatbotMessages.appendChild(msg);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}
// Add opening greeting
addChatMsg({text: 'Hi! Ask me anything about our services 👋', sender: 'bot'});
// Handle submit and send fetch
let sending = false;
document.getElementById('chatbotForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  if(sending) return;
  let input = document.getElementById('chatbotInput');
  let text = input.value.trim();
  if(!text) return;
  addChatMsg({text, sender:'user'});
  input.value='';
  sending = true;
  try {
    let res = await fetch('https://overstay-choosy-succulent.ngrok-free.dev/webhook/chat', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ message: text, companyId: 'agha-khan-repo'})
    });
    let data = await res.json();
    addChatMsg({text: data.reply || 'Sorry, I could not understand. Please try again.', sender:'bot'});
  } catch (_) {
    addChatMsg({text: 'Sorry, there was a connection error.', sender:'bot'});
  }
  sending = false;
});