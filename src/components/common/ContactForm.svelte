<script lang="ts">
    import { getAntiForgeryToken, getRecaptchaToken } from "../../utils";

    let firstName = '';
    let lastName = '';
    let email = '';
    let phone = '';
    let submitting = false;
    let response: null | Response = null;
    let responseMessages: string[] = [];
    let responseClass = '';

    const nameRegex = /^.{2,1000}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const phoneRegex = /^\d{10}$/;

    let fieldInvalid: { [key: string]: boolean | null } = {
        firstName: null,
        lastName: null,
        email: null,
        phone: null,
    };

    const validateField = (fieldName: string, value: string, regex: RegExp = nameRegex, showError: boolean = true): void => {
        if (showError) {
            fieldInvalid[fieldName] = !regex.test(value);
        } else {
            fieldInvalid[fieldName] = regex.test(value) ? false : null;
        }
    };

    // If any of the fields are invalid, form is not valid.
    $: formValid = !Object.values(fieldInvalid).some((value) => value === true || value === null);
    formValid = true;

    const handleSubmit = async () => {
        responseMessages = [];
        submitting = true;
        let error = false;

        validateField('firstName', firstName)
        validateField('lastName', lastName)
        validateField('email', email)
        validateField('phone', phone)

        if (!formValid) {
            responseMessages.push('Invalid form data');
            responseClass = 'warning';
            error = true;
        }

        const tokenValue = await getAntiForgeryToken();
        if(!tokenValue){
            responseMessages.push('Unable to get Anti-Forgery Token');
            responseClass = 'warning';
            error = true;
        }

        const recaptchaToken = await getRecaptchaToken();
        if(!recaptchaToken){
            responseMessages.push('Unable to get Recaptcha Token');
            responseClass = 'warning';
            error = true;
        }

        if(error)
        {
            return
        }

        const contactData = {
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            PhoneNumber: phone,
            RecaptchaToken: recaptchaToken,
        };

        const requestBody = JSON.stringify(contactData);

        try {
            response = await fetch("/Contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'RequestVerificationToken': tokenValue,
                },
                body: requestBody
            });

            if (response.ok) {
                responseMessages.push("Request has been sent");
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
            responseMessages.push('Something went wrong while trying to send the email, try again later');
            responseClass = 'warning';
            return;
        } finally {
            submitting = false;
        }
    };
</script>

<section>
    <h3>Create a contact request</h3>
    <hr>

    <form on:submit|preventDefault={handleSubmit}>

        <label for="firstName">First Name</label>
        <input type="text" id="firstName" bind:value={firstName} 
            on:blur={() => validateField('firstName', firstName)}
            on:input={() => validateField('firstName', firstName, nameRegex, false)}
            aria-invalid={fieldInvalid.firstName} required
            placeholder="name"/>
        <small>{fieldInvalid.firstName ? "Enter a valid first name (min 2 letters)" : ""}</small>
        
        <label for="lastName">Last Name</label>
        <input type="text" id="lastName" bind:value={lastName} 
            on:blur={() => validateField('lastName', lastName)}
            on:input={() => validateField('lastName', lastName, nameRegex, false)}
            aria-invalid={fieldInvalid.lastName} required
            placeholder="surname"/>
        <small>{fieldInvalid.lastName ? "Enter a valid last name (min 2 letters)" : ""}</small>
        
        <label for="email">Email</label>
        <input type="email" id="email" bind:value={email} 
            on:blur={() => validateField('email', email, emailRegex)}
            on:input={() => validateField('email', email, emailRegex, false)}
            aria-invalid={fieldInvalid.email} required
            placeholder="name@example.com"/>
        <small>{fieldInvalid.email ? "Enter a valid email (name@example.com)" : ""}</small>

        <label for="phone">Phone</label>
        <input type="tel" id="phone" bind:value={phone}
            on:blur={() => validateField('phone', phone, phoneRegex)}
            on:input={() => validateField('phone', phone, phoneRegex, false)}
            aria-invalid={fieldInvalid.phone} required
            placeholder="0600000001"/>
        <small>{fieldInvalid.phone ? "Enter a valid phone number (10 digits)" : ""}</small>
        
        <button type="submit" aria-busy={submitting} disabled={!formValid}>
            {submitting ? 'Submitting...' : 'Submit'}
        </button>

        <div>
            {#each responseMessages as message}
            <p class={responseClass}>{message}</p>
            {/each}
        </div>

    </form>
</section>
