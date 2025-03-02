const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const handler = async (request) => {
  const data = JSON.parse(request.body);

  const { email, name, role } = data;

  const msg = {
    to: 'ewein00@gmail.com',
    from: 'elliotedward99@gmail.com',
    subject: 'MBSR Registration Confirmed!',
    text: 'You have successfully registered for the MBSR course',
    html: '<strong>You have successfully registered for the MBSR course</strong>',
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};
