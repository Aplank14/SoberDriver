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
        let trip = document.getElementById('trip');
        trip.innerHTML = data.location + " -> " + data.destination;
        let passengers = document.getElementById('passengers');
        passengers.innerHTML = data.passengers;
        let number = document.getElementById('number');
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