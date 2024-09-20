const generateMailOtpTemplate = (refNumber,otpCode,number) => `
<table>
<tr>
    <td>
       
<div class="row"
style=" display: flex;justify-content: center;background: url('https://templateemailimages.s3.ap-south-1.amazonaws.com/assets/vectors/rectangle3_x2.png'); background-size:100% 110%; background-repeat: no-repeat; ">
<img style="margin-left: 10px;" src="https://templateemailimages.s3.ap-south-1.amazonaws.com/assets/images/newAttplLogo11.png" alt=""
    width="10%" height="30%">
</div>
</td>
</tr>

<tr>
<td>
<div style="padding: 15px;">
<div class="box" style="  border-bottom: 1px solid #3b6978; padding : 50px;">
    <span
        style="font-family: 'Ibarra Real Nova'; font-weight: 300; font-size: 20px; text-transform: uppercase; color: #000000;line-height: 40px;">
        DEAR CUSTOMER,
        <br />
        <br /> Ref. No. ${refNumber}.
        <br /> Your OTP Code is ${otpCode} to verify mobile number.
        <br /> This OTP is valid for ${number} minutes only.
        <br /> Please do not share it with anyone.

        <br /> Thank you,
        <br /> Team ATTPL EMS
    </span>
</div>
</div>
</td>
</tr>

<tr>
<td>
<table align="center" cellpadding="0" cellspacing="0" border="0">
    <tr>
<div
style="text-align: center;margin: 0 auto; margin-bottom: 17.7px;width:  100%;">
<td style=" width: 50px; height: 46px;"><a href="https://www.facebook.com/attplgroup"><img
            src="https://templateemailimages.s3.ap-south-1.amazonaws.com/assets/images/fbLogoRemovebgPreview.png"
            style="width: 100%; height: 100%;" alt="facebook"></a></td>
            <td style="width: 20px;"></td>
<td style="width: 46px; height: 46px;"><a href="https://twitter.com/attplgroup"><img
            src="https://templateemailimages.s3.ap-south-1.amazonaws.com/assets/images/twitter.png"
            style="width: 100%; height: 100%;" alt="twitter"></a></td>
            <td style="width: 20px;"></td>
<td style=" width: 46px; height: 46px;"><a href="https://www.linkedin.com/company/attplgroup/"><img
            src="https://templateemailimages.s3.ap-south-1.amazonaws.com/assets/images/linkedin.png"
            style="width: 100%; height: 100%;" alt="linkedin"></a></td>
            <td style="width: 20px;"></td>
<td style="width: 50px; height: 50px;"><a href="https://www.instagram.com/attplgroup/"><img
            src="https://templateemailimages.s3.ap-south-1.amazonaws.com/assets/images/instaaa.png"
            style="width: 100%; height: 100%;" alt="instagram"></a></td>
            <td style="width: 20px;"></td>
<td style="width: 46px; height: 50px;"><a href="https://www.youtube.com/@attplgroup"><img
            src="https://templateemailimages.s3.ap-south-1.amazonaws.com/assets/images/youtube.png"
            style="width: 100%; height: 100%;" alt="youtube"></a></td>
</div>
</tr>
</table>
</td>
</tr>
<tr>
<td>
<div class="footer" style="text-align:center; color: #3E4551;">
<p>
<div
    style="position: relative; margin: 0 0.6px 25px 0; display: inline-block; overflow-wrap: break-word; font-family: 'Ibarra Real Nova'; font-weight: 400; font-size: 20px; line-height: 1.62; color: #000000;">
    <a href="https://www.google.com/maps/dir/26.9221888,75.7006336/attplgroup+located+in+jaipur/@26.9196675,75.6989558,17z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x396db5936bcc2ec9:0x268dd2b656c0dd61!2m2!1d75.7022783!2d26.9171462?entry=ttu"
        style="text-decoration: none; color: black;">1st Floor, Office No.-4, Opposite Manglam grand vistas,
        Vaishali Nagar West Jaipur, Rajasthan, 302034</a>
</div>
</p>

<p>
    | <a href="https://attplgroup.com/privacy-policy/" style="text-decoration: none; color: black;">Privacy
        Policy</a> | <a href="https://attplgroup.com/terms-conditions/"
        style="text-decoration: none; color: black;"> Terms Of Condition </a>| <a
        href="https://attplgroup.com/cancellation-refund/"
        style="text-decoration: none; color: black;">Cancellation & Refund </a>| <a href="tel:18008900815"
        style="text-decoration: none; color: black;">18008900815</a> |
</p>
<b>&copy;
    <script>document.write(new Date().getFullYear());</script> | All rights reserved
</div>
</td>
</tr>
</table>
    `;
    
module.exports = generateMailOtpTemplate;