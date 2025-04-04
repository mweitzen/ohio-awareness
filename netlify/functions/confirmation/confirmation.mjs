const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const handler = async (request) => {
  const data = JSON.parse(request.body);

  const { email, name, role } = data;

  const msg = {
    to: email,
    from: 'rweiner1@gmail.com',
    subject: 'MBSR Registration Confirmed!',
    text: 'Thank you! You have successfully registered for the MBSR course on 7/12/2025.',
    // html: '<p><strong>Thank You!</strong></p> <p>You have successfully registered for Beyond MBSR.</p><p class="mb-6 font-light sm:text-lg text-base"><span>When:</span> Saturday, July 12, 2025 <br /> 9:00am-4:00pm - Bagels & Coffee at 8:30am <br /> <span >Where:</span> University Hospital Seidman Cancer Center Main Campus <br /> 11100 Euclid Ave, Cleveland, OH 44106 | Meditation Room <br /> Lunch & Dinner Provided </p>',
    html: '<p><strong>Thank You!</strong></p> <p>You have successfully registered for Beyond MBSR.</p><p class="mb-6 font-light sm:text-lg text-base"><span>When:</span> Saturday, July 12, 2025 <br /> 9:00am-4:00pm - Bagels & Coffee at 8:30am <br /> <span >Where:</span> TBD <br /> Lunch & Dinner Provided </p>',
  };

  const emails = [
    'rweiner1@gmail.com',
    'alberto.montero@uhhospitals.org',
    'buckjam@gmail.com',
  ];

  const internalMsg = {
    to: emails,
    from: 'rweiner1@gmail.com',
    subject: 'Someone registered for the 7/12/2025 session!',
    text: `New Registration! Someone just registered for the 7/12/2025 session with email: ${email}`,
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
