(function() {
    const token = localStorage.getItem('token');
    let id = window.location.pathname.substring(7);
    fetch(`/pickup/${id}`, {
        headers: {
            'Authorization': token
        }
    })
        .then(res => res.json())
        .then(data => showData(data));
    function showData(data) {
        let name = document.getElementById('name');
        name.innerHTML = data.name;
        let location = document.getElementById('trip');
        location.innerHTML = data.location;
        let passengers = document.getElementById('passengers');
        passengers.innerHTML = data.passengers;
        let number = document.getElementById('number');
        number.href = "tel:" + data.phone;
        number.innerHTML = data.phone;
    }
}())

function endRide(){
    const token = localStorage.getItem('token');
    let id = window.location.pathname.substring(7);
    fetch(`/dropoff/${id}`, {
        method: "POST",
        headers: {
            'Authorization': token
        }
    })
        .then(res => {
            if(res.status===200){
                window.location.href = '/pickups'; 
            }
        })
}