(function() {
    const form = document.getElementById('new-request-form');
    form.onsubmit = (e) => {
        e.preventDefault();
        let phone = document.getElementById("phone").value;
        const formData = new FormData(form);
        const data = new URLSearchParams();
        for (const pair of formData) {
            data.append(pair[0], pair[1]);
        }
        form.reset();
        fetch("/new-request", {
            method: 'POST',
            body: data
        })
        .then(res => {
            if (res.ok) {
                res.json().then(data => {
                    document.getElementById("rider-phone").href += phone;
                    document.getElementById("rider-phone").innerHTML = phone;
                    document.getElementById("rider-position").innerHTML = data.message;
                    $('#confirmation').modal('show')
                });
            } else {
                window.location.href = "/error.html";
            }
        });
    }
}())
