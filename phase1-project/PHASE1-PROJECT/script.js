//wait for the DOM content to be fully loaded before runnung any script
document.addEventListener('DOMContentLoaded', function() {
    const descriptions = [
        "Connecting grocers and buyers directly for a seamless shopping experience!",
        "Fresh produce delivered straight from the farm to your doorstep.",
        "Support local farmers and enjoy fresh, high-quality groceries.",
        "Eliminate the middleman, save money, and eat healthier."
    ];
    let currentIndex = 0; //track the current description index

    function changeDescription() {
        document.getElementById('dynamicText').innerHTML = `<p>${descriptions[currentIndex]}</p>`; // update the dynamic content periodically
        currentIndex = (currentIndex + 1) % descriptions.length;
    }

    setInterval(changeDescription, 5000);
});

// Show forms based on user type
function showBuyerForm() {
    document.getElementById('authArea').style.display = 'none';
    document.getElementById('buyerForm').style.display = 'block';
}

function showSellerForm() {
    document.getElementById('authArea').style.display = 'none';
    document.getElementById('sellerForm').style.display = 'block';
}

// Authentication functions
async function login(role) {
    const email = document.getElementById(`${role}Email`).value;
    const password = document.getElementById(`${role}Password`).value;
    const response = await fetch(`http://localhost:3000/users?role=${role}`);
    const users = await response.json();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        alert('Login successful!');
        $('#authModal').modal('hide');
        if (role === 'buyer') {
            document.getElementById('productArea').style.display = 'block';
            document.getElementById('feedbackArea').style.display = 'block';
            fetchProducts();
        } else if (role === 'seller') {
            document.getElementById('uploadArea').style.display = 'block';
        }
    } else {
        alert('Invalid credentials. Please try again.');
    }
}

async function register(role) {
    const email = document.getElementById(`${role}Email`).value;
    const password = document.getElementById(`${role}Password`).value;
    const user = { email, password, role };

    const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });

    if (response.ok) {
        alert('Registration successful! You can now sign in.');
    } else {
        alert('Registration failed. Please try again.');
    }
}

// Fetch and display products
async function fetchProducts() {
    const response = await fetch('http://localhost:3000/groceries');
    const data = await response.json();
    displayProducts(data);
}

function displayProducts(data) {
    const productsDiv = document.getElementById('products');
    productsDiv.innerHTML = '';
    data.forEach(product => {
        productsDiv.innerHTML += `
            <div class="card mt-2">
                <div class="card-body">
                    <h5>${product.name}</h5>
                    <p>Origin: ${product.origin}</p>
                    <p>Quality: ${product.quality}</p>
                    <p>Quantity: ${product.quantity}</p>
                    <p>Price: $${product.price}</p>
                    <button onclick="placeOrder(${product.id})" class="btn btn-info">Order</button>
                </div>
            </div>
        `;
    });
}

// Place order function
function placeOrder(productId) {
    alert(`Order placed for product ID: ${productId}`);
}

// Feedback submission
function submitFeedback() {
    const feedback = document.getElementById('feedback').value;
    alert(`Feedback received: ${feedback}`);
}
