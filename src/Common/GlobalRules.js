export const PatientRegistrationFormRules = {
    "name" : [{ required: true, message: 'Please enter the name' },{ whitespace: true, message: 'Name cannot be empty' }],
    "age" : [{ pattern: /^\d*$/}, {message: 'Age must be a number'}]
}