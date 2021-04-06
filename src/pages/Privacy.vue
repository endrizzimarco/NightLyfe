<template lang="pug">
h4(class='title') <mark>Privacy Policy:</mark>
div(class='policy')
  p We recomand our users to read our privacy policy <b>very carfully</b> and contact us if they have any enquiries. 
  p One of our agents will be pleased to answer all of your questions ! 
  p <b>How we use your information ?</b>
  p We use personal information in the file we maintain about you, and other information we obtain from your current and past activities on the Application to provide to you the services offered by the Application; resolve any kind of service disputes; troubleshoot problems; measure users' interest in this service; always keep you updated about any live events happening, deliver information to you that, in some cases, is relevant to your interests, such as new bars/nightclubs opening; customize your experience; detect and protect us against errors, fraud and other criminal activity; enforce our Terms of Service; provide you with system or administrative messages. We may also use personal information about you to improve our services, to analyze Application usage, to improve our application content as well as customizing the Application's content, layout, and services if possible. These uses improve the Application and better tailor it to meet your needs, so as to provide you with a smooth, efficient and most importantly safe experience while using our Application.Please see below under “How we Retain your Personal Information” for information on what we do to account information when you terminate your account with us.
  <br>
  p <b>What information do we collect ?</b>
  p Our primary purpose in collecting personal information from you is to provide you with a safe, smooth and efficient experience as mentioned earlier. This allows us to provide services and features that most likely meet your needs, and to customize our service to make your experience safer and easier. We only collect personal information about you that we consider necessary for achieving this purpose. Once you become a User, we require you to provide various contact and identity information and other personal information as indicated on the relevant forms on the Application, so you become no longer anonymous to us. Where possible, on these forms we indicate some of the fields are required and some others remain optional. In addition, as you use the Application, you can from time to time enter or add some other personal information which migh help us protecting your account. You always have the option to not provide information by choosing not using a particular feature in the Application for which the information is being collected. Following your registration on the Application, you can review and change your information in your account area. If you disclose personal information on the Application and wish to have it removed, please contact us at the support contact information posted on the Application.
  <br>
  p <b>Our disclosure of your information </b>
  p We will not sell or rent your personally identifiable information to third parties without your explicit consent. The following describes some of the ways that your information may be disclosed in the normal scope of business to provide our services:<br>Anonymized Aggregated Data: We aggregate and anonymize data and use and disclose such information for a variety of purposes. However, in these situations, we do not disclose any information that could be used to identify you personally.<br>Public Areas of the Application: All of your activities in the public areas of the Application will be identifiable to your User Name/ID, and other people can see any published content of your.<br>Legal Requests; Emergencies; Jurisdictions: We cooperate with law enforcement inquiries and demands for information that are made under force of law. We are also cognizant of the need to address emergencies. Therefore, we may disclose User and End User personal information: <br>(a) to any governmental authority as part of an investigation to determine our compliance with any applicable law, rule, or regulation (including privacy laws, rules, and regulations), <br>(b) in response to a court order, subpoena, discovery request, or other lawful judicial or administrative proceeding, <br>(c) as otherwise required under any applicable law, rule, or regulation. <br>(d) in good faith, to protect or defend our rights or property or those of other users or End Users.
  <br>
  p <b>Security</b>
  p The protection of your personal information is our priority. For security of transactions, we use high security protocols, which encrypt any personal information you enter into registration forms on the Application. The encryption process protects your information, by scrambling it before it is sent to us from your computer. We also make commercially reasonable effort to ensure the security of your personal information on our system. While we strive to protect your personal information, we will also do our best to secure any information you transmit to us.
  <br>
  p <b>How do we retain your personal information</b>
  p We retain personal information regarding you or your use of the Services for as long as your Account is active or for as long as needed to provide you or our Users with the Services. We also retain personal information for as long as necessary to achieve the purposes described in this Privacy Policy, for example, to comply with our legal obligations, to protect us in the event of disputes and to enforce our agreements and to protect our and others’ interests. You may delete your Account by contacting us at 'help' section on the application and we will delete the personal information it holds about you (unless we need to retain it for the purposes set out in this Privacy Policy). <br>Please note that in the course of providing the Services, we collect and maintain aggregated, anonymized or de-personalized information which we may retain indefinitely.
  <br>
  p <b>Data transfers</b>
  p In case this application goes internationally and gets worldwildly used, your data might be transfered to an other country for some legal purposes but we will always continue protecting your information with appropriate safeguards, but it may be subject to the legal jurisdiction of those countries and governmental authorities in those countries.
<br>
<q-checkbox dense v-model="teal" label="Please check the box if your have read our policy" color="teal" />
q-btn.bg-grey-2.fixed-down-left.q-ma-sm(@click='$router.go(-1)', icon='arrow_back', label='Back')
</template>

<script>
export default {
  data () {
    return {
      teal: false,
    }
  }
}
</script>

<style>
.title {
  text-align:center; 
}
.policy {
  border: 3px solid black; 
  padding: 25px;
}
</style>