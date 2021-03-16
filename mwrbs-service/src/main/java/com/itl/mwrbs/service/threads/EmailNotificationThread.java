package com.itl.mwrbs.service.threads;

import java.util.List;

import org.apache.log4j.Logger;

import com.db.lib.utils.CryptoUtil;
import com.itl.mwrbs.service.GlobalConfig;
import com.itl.mwrbs.service.helper.EmailHelper;
import com.itl.mwrbs.service.models.EmailNotificationRequest;
import com.itl.mwrbs.service.models.EmailRequest;
import com.itl.mwrbs.service.models.EmailSettings;
import com.itl.mwrbs.service.repositories.CommonRepository;

public class EmailNotificationThread implements Runnable {

	private static Logger LOGGER = Logger.getLogger(EmailNotificationThread.class);
	
	@Override
	public void run() {
		try {
            while (GlobalConfig.getInstance().getCanContinue()) {
            	CommonRepository repo = null;
                try {
                    Thread.sleep(5000);
                    repo = new CommonRepository();
                    
                    List<EmailNotificationRequest> notifications = repo.getPendingEmailNotificationRequests();
                    EmailSettings emailSettings = repo.getEmailSettings();
                    emailSettings.setPassword(CryptoUtil.decrypt(emailSettings.getPassword()));
                    EmailHelper emailHelper = new EmailHelper();
                    
                    for (EmailNotificationRequest request: notifications) {
                    	EmailRequest emailRequest = new EmailRequest();
            			String templateName = "";
            			String body = "";
                    	try {
                    		if (request.getEmailTypeId() == 1) { // PENDING/FOR APPROVAL NOTIFICATION
                    			templateName = "guest-info.html";
                    			body = emailHelper.getEmailTemplate(templateName);
                    			body = emailHelper.replaceReservationDetail(body, request);

                    			emailRequest.setBody(body);
                    			emailRequest.setSubject("Room Reservation");
                    			emailRequest.setRecipients(request.getEmailAddress());
                    			
                    			emailHelper.sendEmail(emailRequest, emailSettings);
                    			
                    			// NOTIFICATION TO RECEPTIONIST
                    			boolean hasPayment = request.getReservationPaymentId() > 0 ? true : false;
                    			templateName = "guest-info-receptionist" + (hasPayment ? "-with-payment.html" : ".html");
                    			body = emailHelper.getEmailTemplate(templateName);
                    			body = emailHelper.replaceReservationDetail(body, request);
                    			if (hasPayment) {
                    				body = emailHelper.replacePaymentDetail(body, request);
                    			}
                    			emailRequest.setBody(body);
                    			emailRequest.setSubject("Pending Reservation for Approval - " + request.getReferenceNumber());
                    			emailRequest.setRecipients(repo.getReceptionistEmailAddresses());
                    			emailHelper.sendEmail(emailRequest, emailSettings);
                    		} else if (request.getEmailTypeId() == 2) { // RESERVATION APPROVAL NOTIFICATION
                    			templateName = "guest-approved.html";
                    			body = emailHelper.getEmailTemplate(templateName);
                    			body = emailHelper.replaceReservationDetail(body, request);
                    			emailRequest.setBody(body);
                    			emailRequest.setSubject("Room Reservation - " + request.getReferenceNumber());
                    			emailRequest.setRecipients(request.getEmailAddress());
                    			emailHelper.sendEmail(emailRequest, emailSettings);
                    		} else if (request.getEmailTypeId() == 4) { // UNAVAILABLE RESERVATION
                    			templateName = "guest-unavailable.html";
                    			body = emailHelper.getEmailTemplate(templateName);
                    			body = emailHelper.replaceReservationDetail(body, request);
                    			emailRequest.setBody(body);
                    			emailRequest.setSubject("Room Reservation - " + request.getReferenceNumber());
                    			emailRequest.setRecipients(request.getEmailAddress());
                    			emailHelper.sendEmail(emailRequest, emailSettings);
                    		} else if (request.getEmailTypeId() == 5) { // AUTO CLOSED/UPAID RESERVATION
                    			templateName = "guest-auto-closed.html";
                    			body = emailHelper.getEmailTemplate(templateName);
                    			body = emailHelper.replaceReservationDetail(body, request);
                    			emailRequest.setBody(body);
                    			emailRequest.setSubject("Room Reservation - " + request.getReferenceNumber());
                    			emailRequest.setRecipients(request.getEmailAddress());
                    			emailHelper.sendEmail(emailRequest, emailSettings);
                    		} else if (request.getEmailTypeId() == 6) { // PAYMENT NOTIFICATION
                    			templateName = "guest-payment.html";
                    			body = emailHelper.getEmailTemplate(templateName);
                    			body = emailHelper.replaceReservationDetail(body, request);
                    			body = emailHelper.replacePaymentDetail(body, request);
                    			emailRequest.setBody(body);
                    			emailRequest.setSubject("Payment Made - " + request.getReferenceNumber());
                    			emailRequest.setRecipients(repo.getReceptionistEmailAddresses());
                    			emailHelper.sendEmail(emailRequest, emailSettings);
                    		} else if (request.getEmailTypeId() == 7) { // RE-SCHEDULE NOTIFICATION
                    			templateName = "guest-for-reschedule.html";
                    			body = emailHelper.getEmailTemplate(templateName);
                    			body = emailHelper.replaceReservationDetail(body, request);
                    			emailRequest.setBody(body);
                    			emailRequest.setSubject("Re-schedule Reservation - " + request.getReferenceNumber());
                    			emailRequest.setRecipients(repo.getReceptionistEmailAddresses());
                    			emailHelper.sendEmail(emailRequest, emailSettings);
                    		}
                    		if (request.getEmailTypeId() != 7) {
                    			request.setReservationId(0);
                    		}
                    		repo.setEmailNotificationStatus(request, true);
                    	} catch (Exception e) {
                    		LOGGER.error(String.format("Email notification failed for email type id: %d; reservation id: %d; status id: %d; payment id: %d",
                    			request.getEmailTypeId(), request.getReservationId(), request.getStatusId(), request.getPaymentTypeId()), e);
                    		repo.setEmailNotificationStatus(request, false);
                    	}
                    }
                } catch (Exception ie) {
                	LOGGER.error(String.format("run-while : %s", ie));
                }
                finally{
                	repo.dispose();
                }
            }
        } catch (Exception e) {
        	LOGGER.error(String.format("run : %s", e));
        }
	}

}
