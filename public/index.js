// Burger menu toggle (already working)
const burger = document.querySelector('.burger');
const navbarItems = document.querySelector('.navbar-items');
const nav = document.querySelector('.nav');

burger.addEventListener('click', () => {
  navbarItems.classList.toggle('h-class');
  nav.classList.toggle('v-class');
});

// ✅ Handle form submission
const form = document.getElementById('contactForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const message = document.getElementById('message').value.trim();

  try {
    const res = await fetch('https://hospital-backend-lvd2.onrender.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, phone, message }),
    });

    const data = await res.json();
    alert(data.message || 'Successfully submitted!');
    form.reset(); // clear the form after submission
  } catch (error) {
    console.error('❌ Error submitting form:', error);
    alert('Failed to submit the form. Please try again later.');
  }
});
