(function() {
    const form = document.getElementById('new-request-form');
    form.onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = new URLSearchParams();
        for (const pair of formData) {
            data.append(pair[0], pair[1]);
        }
        form.reset();
        fetch("/new-request", {
            method: "POST",
            body: data,
        })
        .then(res => {
            if (res.ok) {
                window.location.href = "/success.html";
            } else {
                window.location.href = "/error.html";
            }
        });
    }
}())
