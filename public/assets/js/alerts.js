//Acciones de botones
$('#btnSavePostulation').click(function() {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Los usuarios se han actualizado',
        showConfirmButton: false,
        timer: 1500
    });
    mostrarUsuarios();
});