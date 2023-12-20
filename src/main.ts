import './css/pico.css';
import './css/style.css';
import ProfilePage from "./components/pages/ProfilePage.svelte";
import ContactPage from "./components/pages/ContactPage.svelte";

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

initializeComponents();
