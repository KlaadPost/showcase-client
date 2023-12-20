<script lang="ts">
    let firstName = '';
    let lastName = '';
    let email = '';
    let phone = '';
    let submitting = false;
    let response: null | Response = null;
    let responseMessages: string[] = [];
    let responseClass = '';

    let fieldInvalid: { [key: string]: boolean | null } = {
        firstName: null,
        lastName: null,
        email: null,
        phone: null,
    };

    // Key is exposed to users 
    const reCaptchaClientKey = "6Lc_9TcpAAAAAIdlMq6r78wsWDrj6cELayKQWvw4"
    const nameRegex = /^.{2,1000}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const phoneRegex = /^\d{10}$/;

    const validateField = (fieldName: string, value: string, regex: RegExp = nameRegex, showError: boolean = true): void => {
        if (showError) {
            fieldInvalid[fieldName] = !regex.test(value);
        } else {
            fieldInvalid[fieldName] = regex.test(value) ? false : null;
        }
    };

    // If any of the fields are invalid, form is not valid.
    $: formValid = !Object.values(fieldInvalid).some((value) => value === true || value === null);

    const handleSubmit = async () => {
        validateField('firstName', firstName)
        validateField('lastName', lastName)
        validateField('email', email)
        validateField('phone', phone)

        if (!formValid) {
            return;
        }

        responseMessages = [];

        const contactData = {
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            PhoneNumber: phone
        };

        const requestBody = JSON.stringify(contactData);

        submitting = true;
        try {
            response = await fetch("https://localhost:44336/Contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: requestBody
            });

            if (response.ok) {
                responseMessages.push('Email is verzonden');
                responseClass = 'success';

                // Clear fields
                firstName = '';
                lastName = '';
                email = ''; 
                phone = '';

                // Reset validation classes
                fieldInvalid['firstName'] = null;
                fieldInvalid['lastName'] = null;
                fieldInvalid['email'] = null;
                fieldInvalid['phone'] = null;

            } else {
                const errorResponse: { [key: string]: string[] } = await response.json();
                responseMessages = Object.values(errorResponse)
                    .flatMap((errors: string[]) => errors)
                responseClass = 'warning';
            }
        } catch (error) {
            responseMessages.push('Er ging iets fout tijdens het versturen van de mail.');
            responseClass = 'warning';
        } finally {
            submitting = false;
        }
    };
</script>

<section>

    <h3>Maak een contactverzoek</h3>

    <form on:submit|preventDefault={handleSubmit}>

        <label for="firstName">Voornaam
            <em class="secondary">&nbsp;{fieldInvalid.firstName ? "• Voer een geldige voornaam in (min 2 letters)" : ""}</em>
        </label>
        <input type="text" id="firstName" bind:value={firstName} 
            on:blur={() => validateField('firstName', firstName)}
            on:input={() => validateField('firstName', firstName, nameRegex, false)}
            aria-invalid={fieldInvalid.firstName} required/>
        
        <label for="lastName">Achternaam
            <em class="secondary">&nbsp;{fieldInvalid.lastName ? "• Voer een geldige achternaam in (min 2 letters)" : ""}</em>
        </label>
        <input type="text" id="lastName" bind:value={lastName} 
            on:blur={() => validateField('lastName', lastName)}
            on:input={() => validateField('lastName', lastName, nameRegex, false)}
            aria-invalid={fieldInvalid.lastName} required/>
        
        <label for="email">Email
            <em class="secondary">&nbsp;{fieldInvalid.email ? "• Voer een geldige email in (iemand@example.nl)" : ""}</em>
        </label>
        <input type="email" id="email" bind:value={email} 
            on:blur={() => validateField('email', email, emailRegex)}
            on:input={() => validateField('email', email, emailRegex, false)}
            aria-invalid={fieldInvalid.email} required/>
        
        <label for="phone">Telefoon
            <em class="secondary">&nbsp;{fieldInvalid.phone ? "• Voer een geldig telefoonnummer in (10 cijfers)" : ""}</em>
        </label>
        <input type="tel" id="phone" bind:value={phone}
            on:blur={() => validateField('phone', phone, phoneRegex)}
            on:input={() => validateField('phone', phone, phoneRegex, false)}
            aria-invalid={fieldInvalid.phone} required/>
        
        <button type="submit" aria-busy={submitting} disabled={!formValid}>
            {submitting ? 'Verzenden...' : 'Verzenden'}
        </button>

        <div>
            {#each responseMessages as message}
            <p class={responseClass}>{message}</p>
            {/each}
        </div>

    </form>
</section>
