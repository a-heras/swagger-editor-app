import { toast } from 'sonner';

export function showError(message: string) {
    toast.error(message, { id: `error:${message}` });
}

export function showSuccess(message: string) {
    toast.success(message, { id: `success:${message}` });
}

export function showInfo(message: string) {
    toast.message(message, { id: `info:${message}` });
}
