function switchDay(dayId, btnElement) {
    // Hide all tables
    const tables = document.querySelectorAll('.schedule-table');
    tables.forEach(table => table.classList.remove('active'));

    // Remove active state from all tab buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Activate the targeted day's table and button
    document.getElementById(dayId).classList.add('active');
    btnElement.classList.add('active');
}