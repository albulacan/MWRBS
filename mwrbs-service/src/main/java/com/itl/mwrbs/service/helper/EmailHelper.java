package com.itl.mwrbs.service.helper;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Properties;
import java.util.stream.Collectors;

import javax.mail.Authenticator;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import org.apache.log4j.Logger;

import com.itl.mwrbs.service.models.EmailNotificationRequest;
import com.itl.mwrbs.service.models.EmailRequest;
import com.itl.mwrbs.service.models.EmailSettings;
import com.microsoft.sqlserver.jdbc.StringUtils;

public class EmailHelper {
	private static Logger LOGGER = Logger.getLogger(EmailHelper.class);
	
	ClassLoader classLoader = null;
	SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	
	public EmailHelper() {
		classLoader = getClass().getClassLoader();
	}
	
	public String getEmailTemplate(String templateName) throws IOException, URISyntaxException {
		InputStream is = classLoader.getResourceAsStream("email-templates/" + templateName);
        if (is == null) {
            throw new IllegalArgumentException("file not found! " + templateName);
        }
        String content = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8)).lines().collect(Collectors.joining("\n"));
        return content;
    }
	
	public String replaceReservationDetail(String body, EmailNotificationRequest request) {
		Timestamp expDate = request.getCreatedOn();
		Calendar cal = Calendar.getInstance();
		cal.setTime(expDate);
		cal.add(Calendar.DAY_OF_WEEK, 3);
		expDate.setTime(cal.getTime().getTime());
		
		body = body
			.replace("&lt;Guest&gt;", request.getFirstName())
			.replace("&lt;ReferenceNumber&gt;", request.getReferenceNumber())
			.replace("&lt;RoomType&gt;", request.getRoomTypeName())
			.replace("&lt;CheckInDate&gt;", dateFormat.format(request.getCheckInDate()))
			.replace("&lt;CheckOutDate&gt;", dateFormat.format(request.getCheckOutDate()))
			.replace("&lt;NoOfGuest&gt;", String.valueOf(request.getNoOfGuest()))
			.replace("&lt;TotalAmountDue&gt;", String.valueOf(request.getTotalAmountDue()))
			.replace("&lt;HalfDue&gt;", String.valueOf(request.getTotalAmountDue().divide(new BigDecimal(2))))
			.replace("&lt;ExpirationDate&gt;", String.valueOf(expDate));
		return body;
	}
	
	public String replacePaymentDetail(String body, EmailNotificationRequest request) {
		body = body
			.replace("&lt;PaymentType&gt;", request.getPaymentTypeName())
			.replace("&lt;AccountNumber&gt;", request.getAccountNumber())
			.replace("&lt;AccountName&gt;", request.getAccountName())
			.replace("&lt;Amount&gt;", String.valueOf(request.getAmount()));
		return body;
	}
	
	public void sendEmail(EmailRequest request, EmailSettings config) throws Exception {
		try {
			List<String> recipients = null;
			List<String> cCopys = null;
			if (!StringUtils.isEmpty(request.getRecipients())) {
				recipients = Arrays.asList(request.getRecipients().split(","));
			}
			
			if (!StringUtils.isEmpty(request.getcCopy())) {
				cCopys = Arrays.asList(request.getcCopy().split(","));
			}
			
			Session session = this.getSession(config);
	
			if (!StringUtils.isEmpty(config.getUsername()) && !StringUtils.isEmpty(config.getPassword())) {
				session = this.getSSLAuthentication(config, config.getUsername(), config.getPassword());
			}
			
			Message message = new MimeMessage(session);
			message.setFrom(new InternetAddress(String.format("Montalban Waterpark and Garden Resort <%s>", config.getSmtpServer())));
			message.setSubject(request.getSubject());
			message.setSentDate(new Date());
			
			Multipart messageBody = this.getMessageBody(request);
			message.setContent(messageBody);
			
			if (recipients != null && !recipients.isEmpty()) {
				for (String recipient : recipients) {
					message.addRecipients(Message.RecipientType.TO, InternetAddress.parse(recipient.trim(), true));
				}
			}
			
			if (cCopys != null && !cCopys.isEmpty()) {
				for (String cCopy: cCopys) {
					message.addRecipients(Message.RecipientType.CC, InternetAddress.parse(cCopy.trim(), true));
				}
			}
			
			Transport.send(message);
		} catch (Exception e) {
			LOGGER.error("An error occured when sending email. From: " + config.getUsername() + ", To: " + request.getRecipients(), e);
			throw e;
		}
	}
	
	private Session getSession(EmailSettings config) {
		Properties props = System.getProperties();
		props.put("mail.smtp.host", config.getSmtpServer());
		props.put("mail.smtp.port", config.getSmtpPort());
		props.put("mail.smtp.ssl.trust", config.getSmtpServer());
		props.put("mail.smtp.connectiontimeout", 30 * 60000);
		props.put("mail.smtp.timeout", 30 * 60000);
		props.put("mail.smtp.socketFactory.fallback", "true");
		props.remove("mail.smtp.socketFactory.port");
		props.remove("mail.smtp.socketFactory.class");
		props.remove("mail.smtp.auth");
		
		return Session.getInstance(props);
	}
	
	private Session getSSLAuthentication(EmailSettings config, final String username, final String password) throws Exception {
		Properties props = System.getProperties();
		props.put("mail.smtp.host", config.getSmtpServer());
		props.put("mail.smtp.socketFactory.port", config.getSmtpPort());
		props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.port", config.getSmtpPort());
		props.put("mail.smtp.socketFactory.fallback", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.EnableSSL.enable", "true");
		
		Authenticator auth = new Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(username, password);
			}
		};
		
		return Session.getInstance(props, auth);
	}
	
	private Multipart getMessageBody(EmailRequest request) throws Exception {
		Multipart multipart = new MimeMultipart();
		BodyPart msgBodyPart = new MimeBodyPart(); 
		msgBodyPart.setContent(request.getBody(), "text/html");
		multipart.addBodyPart(msgBodyPart);
		return multipart;
	}
	
}
