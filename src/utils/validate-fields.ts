export const validateFields = (fields) => {
    const errors = fields
        .map(f => {
            if (!f.value)
                return `Field name ${f.name} is mandatory!`
        })
        .filter(n => n);

    return errors.length === 0 ? null : errors;
};