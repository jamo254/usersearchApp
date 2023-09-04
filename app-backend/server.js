const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { check, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

const data = [
    { email: 'jim@gmail.com', number: '221122' },
    { email: 'jam@gmail.com', number: '830347' },
    { email: 'john@gmail.com', number: '221122' },
    { email: 'jams@gmail.com', number: '349425' },
    { email: 'jams@gmail.com', number: '141424' },
    { email: 'jill@gmail.com', number: '822287' },
    { email: 'jill@gmail.com', number: '822286' },
];

app.post('/search', [
    check('email').isEmail().withMessage('Invalid email format'),
    check('number').optional().matches(/^\d{2}-\d{2}-\d{2}$/).withMessage('Invalid number format'),
],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { email, number } = req.body;
            // Delay the request processing by 5 seconds
            setTimeout(() => {
                const result = data.filter((user) => {
                    return user.email === email && (!number || user.number.includes(number.replace(/-/g, '')));
                });

                res.json(result);
            }, 1000);
        } catch (error) {
            console.error('Error in /search endpoint:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
