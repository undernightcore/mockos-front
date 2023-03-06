import Swal, { SweetAlertIcon } from 'sweetalert2';

export function openToast(title: string, type: SweetAlertIcon, timer = 2000) {
  Swal.fire({
    toast: true,
    position: 'bottom-right',
    icon: type,
    title,
    showConfirmButton: false,
    timer,
  });
}
