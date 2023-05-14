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
