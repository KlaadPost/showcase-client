import './css/pico.css';
import './css/style.css';
import ProfilePage from "./components/pages/ProfilePage.svelte";
import ContactPage from "./components/pages/ContactPage.svelte";
import "./modal-behavior"

function initializeComponents() {
    const profileTarget = document.getElementById('profile');
    const contactTarget = document.getElementById('contact');

    if (profileTarget) {
        new ProfilePage({ target: profileTarget });
    }

    if (contactTarget) {
        new ContactPage({ target: contactTarget });
    }
}

function addReCaptcha(){
    const script = document.createElement('script');
    script.src = "https://www.google.com/recaptcha/api.js?render=6Lc_9TcpAAAAAIdlMq6r78wsWDrj6cELayKQWvw4";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

addReCaptcha();
initializeComponents();
