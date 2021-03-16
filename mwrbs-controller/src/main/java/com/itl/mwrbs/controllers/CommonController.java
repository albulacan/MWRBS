package com.itl.mwrbs.controllers;

import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.db.lib.utils.CryptoUtil;
import com.itl.mwrbs.helpers.EmailHelper;
import com.itl.mwrbs.models.DefaultValues;
import com.itl.mwrbs.models.EmailRequest;
import com.itl.mwrbs.models.EmailSettings;
import com.itl.mwrbs.models.HttpResponse;
import com.itl.mwrbs.repositories.CommonRepository;
import com.itl.mwrbs.repositories.MaintenanceRepository;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/common")
public class CommonController {
	
	private static final Logger LOGGER = Logger.getLogger(CommonController.class);
	
	@GetMapping("/get-default-values")
	public HttpResponse<DefaultValues> getDefaultValues() {
		CommonRepository commonRepo = null;
		try {
			commonRepo = new CommonRepository();
			DefaultValues defaults = new DefaultValues();
			defaults.paymentTypes = commonRepo.getPaymentTypes();
			defaults.roomTypes = commonRepo.getRoomTypes();
			defaults.userTypes = commonRepo.getUserTypes();
			defaults.roomStatuses = commonRepo.getRoomStatuses();
			defaults.reservationStatuses = commonRepo.getReservationStatuses();
			return HttpResponse.success(defaults);
		} catch (Exception e) {
			LOGGER.error("Get default values failed. Exception occured.", e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			commonRepo.dispose();
		}
	}
	
	@PostMapping("/send-email")
	public HttpResponse<?> sendEmail(@RequestBody EmailRequest request) {
		MaintenanceRepository maintenanceRepo = null;
		try {
			maintenanceRepo = new MaintenanceRepository();
			EmailSettings settings = maintenanceRepo.getEmailSettings();
			if (settings == null) {
				return HttpResponse.failed("Email settings is not configured");
			}
			settings.setPassword(CryptoUtil.decrypt(settings.getPassword()));
			EmailHelper emailHelper = new EmailHelper();
			emailHelper.sendEmail(request, settings);
			return HttpResponse.success();
		} catch (Exception e) {
			LOGGER.error("Unable to send email. Exception occured.", e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			maintenanceRepo.dispose();
		}
	}

}
