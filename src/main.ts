import Profile from './components/Profile.svelte';
import Contact from './components/Contact.svelte';

function initializeComponents() {
    const profileTarget = document.getElementById('profile');
    const contactTarget = document.getElementById('contact');

    if (profileTarget) {
        new Profile({ target: profileTarget });
    }

    if (contactTarget) {
        new Contact({ target: contactTarget });
    }
}

function addUILibrary() {
    const styleNode = document.createElement('link');
    styleNode.href = "";
    styleNode.rel = "stylesheet"
    document.head.appendChild(styleNode);
}

initializeComponents();
addUILibrary();
