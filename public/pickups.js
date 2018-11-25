(function() {
    const token = localStorage.getItem('token');
    fetch("/requests", {
        method: "GET",
        headers: {
            'Authorization': token
        }
    })
    .then(res => {
        if(res.status===200){
            res.json().then(data => display(data));
        } else {
            window.location.href="/login.html";
        }
    })
    function display(data){
        data.forEach(item => showData(item));
    }
    function showData(item) {
        let table = document.getElementById('pickup-table');      
        let row = document.createElement('tr');
        let name = document.createElement('td');
        name.innerHTML = item.name;
        let location = document.createElement('td');
        location.innerHTML = item.location;        
        let destination = document.createElement('td');
        destination.innerHTML = item.destination;
        let riders = document.createElement('td');
        riders.innerHTML = item.passengers;
        let link = document.createElement('a');
        link.href=`rider/${item.id}`;
        let pickupData = document.createElement('td');
        let button = document.createElement('button');
        button.className = "btn btn-info"
        button.innerHTML = "Pickup";
        link.appendChild(button);
        pickupData.appendChild(link);
        row.appendChild(name);
        row.appendChild(location);
        row.appendChild(destination);
        row.appendChild(riders);
        row.appendChild(pickupData);
        table.appendChild(row);
    }
}
())
