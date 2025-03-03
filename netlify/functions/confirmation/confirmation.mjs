const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const handler = async (request) => {
  const data = JSON.parse(request.body);

  const { email, name, role } = data;

  const msg = {
    to: email,
    from: 'rweiner1@gmail.com',
    subject: 'MBSR Registration Confirmed!',
    text: 'Thank you! You have successfully registered for the MBSR course',
    html: '<p><strong>Thank You!</strong></p> <p>You have successfully registered for the MBSR course</p>',
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
