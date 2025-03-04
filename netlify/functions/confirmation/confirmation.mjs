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

  // "rweiner1@gmail.com",
  const emails = ['ewein00@gmail.com', 'mweitzenhoffer@gmail.com'];

  const internalMsg = {
    to: emails,
    from: 'rweiner1@gmail.com',
    subject: 'Someone registered for the 5/5/2025 session!',
    text: `New Registration! Someone just registered for the 5/5/2025 session with email: ${email}`,
    html: `<p><strong>New Registration!</strong></p> <p>Someone just registered for the 5/5/2025 session with email: ${email}</p>`,
  };

  try {
    await sgMail.send(msg);
    await sgMail.send(internalMsg);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};
