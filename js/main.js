document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // Active page highlighting
  const currentPath = window.location.pathname;
  const page = currentPath.split('/').pop() || 'index.html';
  
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Contact Form Mock Submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Select input values
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const message = document.getElementById('form-message').value;

      if (!name || !email || !message) {
        alert('Please fill out all required fields.');
        return;
      }

      // Display a visual success state
      const formContainer = contactForm.parentElement;
      formContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; background-color: var(--color-bg-white); border-radius: var(--radius-md); box-shadow: var(--shadow-md);">
          <div style="color: var(--color-success); font-size: 3.5rem; margin-bottom: 20px;">✓</div>
          <h3 style="font-family: var(--font-heading); color: var(--color-primary); font-size: 1.8rem; margin-bottom: 12px;">Message Sent Successfully!</h3>
          <p style="color: var(--color-text-light); margin-bottom: 24px;">Thank you, ${name}. We have received your query and will contact you at ${email} shortly.</p>
          <a href="index.html" class="btn btn-primary">Return to Home</a>
        </div>
      `;
    });
  }

  // Admission Inquiry Form Mock Submission
  const admissionForm = document.getElementById('admission-inquiry-form');
  if (admissionForm) {
    admissionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const parentName = document.getElementById('parent-name').value;
      const studentName = document.getElementById('student-name').value;
      const grade = document.getElementById('grade-interest').value;
      
      const formContainer = admissionForm.parentElement;
      formContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; background-color: var(--color-bg-white); border-radius: var(--radius-md); box-shadow: var(--shadow-md);">
          <div style="color: var(--color-secondary); font-size: 3.5rem; margin-bottom: 20px;">★</div>
          <h3 style="font-family: var(--font-heading); color: var(--color-primary); font-size: 1.8rem; margin-bottom: 12px;">Inquiry Registered!</h3>
          <p style="color: var(--color-text-light); margin-bottom: 24px;">Thank you ${parentName}. We have registered interest for ${studentName} seeking admission in ${grade}. Our admissions officer will get in touch soon.</p>
          <a href="index.html" class="btn btn-primary">Return to Home</a>
        </div>
      `;
    });
  }
});
