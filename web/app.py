import os
import time
from flask import Flask, render_template_string, request, redirect, url_for
import psycopg2
from psycopg2 import OperationalError

app = Flask(__name__)

def get_db_connection():
    """Establishes a connection to the database with retry logic."""
    retries = 10
    delay = 2
    for i in range(retries):
        try:
            conn = psycopg2.connect(
                host=os.environ.get('DB_HOST'),
                dbname=os.environ.get('DB_NAME'),
                user=os.environ.get('DB_USER'),
                password=os.environ.get('DB_PASS')
            )
            return conn
        except OperationalError as e:
            print(f"Database connection failed: {e}")
            if i < retries - 1:
                time.sleep(delay)
                delay *= 2  # Exponential backoff
            else:
                raise

def init_db():
    """Initializes the database and creates the policies table if it doesn't exist."""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('''
        CREATE TABLE IF NOT EXISTS policies (
            id SERIAL PRIMARY KEY,
            applicant_name VARCHAR(255) NOT NULL,
            policy_type VARCHAR(50),
            coverage_amount DECIMAL(10, 2),
            premium DECIMAL(10, 2),
            status VARCHAR(50) DEFAULT 'Quote'
        );
    ''')
    conn.commit()
    cur.close()
    conn.close()

HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Insurance Policy Management</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 text-gray-900">
    <div class="container mx-auto p-8">
        <h1 class="text-3xl font-bold mb-6 text-center">Insurance Policy Management</h1>

        <!-- Add Policy Form -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 class="text-2xl font-semibold mb-4">Create a New Quote</h2>
            <form action="/add_quote" method="post" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label for="applicant_name" class="block text-sm font-medium text-gray-700">Applicant Name</label>
                    <input type="text" name="applicant_name" id="applicant_name" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>
                <div>
                    <label for="policy_type" class="block text-sm font-medium text-gray-700">Policy Type</label>
                    <select name="policy_type" id="policy_type" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                        <option>Auto</option>
                        <option>Home</option>
                        <option>Life</option>
                        <option>Health</option>
                    </select>
                </div>
                <div>
                    <label for="coverage_amount" class="block text-sm font-medium text-gray-700">Coverage Amount ($)</label>
                    <input type="number" step="0.01" name="coverage_amount" id="coverage_amount" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>
                <div>
                    <label for="premium" class="block text-sm font-medium text-gray-700">Premium ($)</label>
                    <input type="number" step="0.01" name="premium" id="premium" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>
                <div class="md:col-span-2">
                    <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Add Quote</button>
                </div>
            </form>
        </div>

        <!-- Policies List -->
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-semibold mb-4">Current Policies</h2>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coverage</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        {% for policy in policies %}
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">{{ policy[0] }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ policy[1] }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ policy[2] }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${{ "%.2f"|format(policy[3]) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${{ "%.2f"|format(policy[4]) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    {% if policy[5] == 'Quote' %} bg-yellow-100 text-yellow-800 
                                    {% elif policy[5] == 'Active' %} bg-green-100 text-green-800 
                                    {% endif %}">
                                    {{ policy[5] }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {% if policy[5] == 'Quote' %}
                                <form action="/update_status/{{ policy[0] }}" method="post" class="inline">
                                    <button type="submit" class="text-indigo-600 hover:text-indigo-900">Activate</button>
                                </form>
                                {% endif %}
                                <form action="/delete/{{ policy[0] }}" method="post" class="inline ml-4">
                                    <button type="submit" class="text-red-600 hover:text-red-900">Delete</button>
                                </form>
                            </td>
                        </tr>
                        {% endfor %}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>
</html>
"""

@app.route('/')
def index():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM policies ORDER BY id;')
    policies = cur.fetchall()
    cur.close()
    conn.close()
    return render_template_string(HTML_TEMPLATE, policies=policies)

@app.route('/add_quote', methods=['POST'])
def add_quote():
    applicant_name = request.form['applicant_name']
    policy_type = request.form['policy_type']
    coverage_amount = request.form['coverage_amount']
    premium = request.form['premium']
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        'INSERT INTO policies (applicant_name, policy_type, coverage_amount, premium, status) VALUES (%s, %s, %s, %s, %s)',
        (applicant_name, policy_type, coverage_amount, premium, 'Quote')
    )
    conn.commit()
    cur.close()
    conn.close()
    return redirect(url_for('index'))

@app.route('/update_status/<int:id>', methods=['POST'])
def update_status(id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('UPDATE policies SET status = %s WHERE id = %s', ('Active', id))
    conn.commit()
    cur.close()
    conn.close()
    return redirect(url_for('index'))

@app.route('/delete/<int:id>', methods=['POST'])
def delete_policy(id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM policies WHERE id = %s;', (id,))
    conn.commit()
    cur.close()
    conn.close()
    return redirect(url_for('index'))

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000)
