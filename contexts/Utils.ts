export const getFormData = (element: string) => {
    const form = document.querySelector(element) as HTMLFormElement;
    const data = new FormData(form);

    const obj: {[key: string]: FormDataEntryValue} = {};
    
    for (const i of data.entries()) {
        obj[i[0]] = i[1];
    }
    return obj;
};

export const daysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

export const getFirstDayOfWeeks = (year: number, month: number) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 (dimanche) à 6 (samedi)
    const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Ajustement pour obtenir le lundi
    const firstDateOfWeek = new Date(year, month, 1 - offset);
    const firstDays = [];
  
    while (firstDateOfWeek.getMonth() <= month && firstDateOfWeek.getFullYear() === year) {
        const date = new Date(firstDateOfWeek).toLocaleDateString('fr-FR');
        firstDays.push(date);
        firstDateOfWeek.setDate(firstDateOfWeek.getDate() + 7);
    }
    
    return firstDays;
}

export const downloadPDF = (buffer: Buffer) => {
    const link = document.createElement('a');
    link.href = "data:application/pdf;base64," + buffer;
    link.download = 'invoice.pdf';
    link.click();
    link.remove();
}