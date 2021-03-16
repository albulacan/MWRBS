package com.itl.mwrbs.controllers;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.db.lib.utils.CryptoUtil;
import com.itl.mwrbs.models.DataGridRequest;
import com.itl.mwrbs.models.DataGridResponse;
import com.itl.mwrbs.models.EmailSettings;
import com.itl.mwrbs.models.HttpResponse;
import com.itl.mwrbs.models.PaymentDetail;
import com.itl.mwrbs.models.RoomDetail;
import com.itl.mwrbs.repositories.MaintenanceRepository;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/maintenance")
public class MaintenanceController {
	
	private static final Logger LOGGER = Logger.getLogger(MaintenanceController.class);
	
	@GetMapping("/get-room-rates")
	public HttpResponse<List<RoomDetail>> getRoomRates() {
		MaintenanceRepository maintenanceRepo = null;
		try {
			maintenanceRepo = new MaintenanceRepository();
			List<RoomDetail> rates = maintenanceRepo.getRoomRates();
			return HttpResponse.success(rates);
		} catch (Exception e) {
			LOGGER.error("Get room rates failed. Exception occured.", e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			maintenanceRepo.dispose();
		}
	}
	
	@PostMapping("/get-room-rate")
	public HttpResponse<RoomDetail> getRoomRate(@RequestBody RoomDetail request) {
		MaintenanceRepository maintenanceRepo = null;
		try {
			maintenanceRepo = new MaintenanceRepository();
			RoomDetail rates = maintenanceRepo.getRoomRate(request.getRoomTypeId());
			return HttpResponse.success(rates);
		} catch (Exception e) {
			LOGGER.error("Get room rate failed. Exception occured.", e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			maintenanceRepo.dispose();
		}
	}
	
	@PostMapping("/get-payment-detail")
	public HttpResponse<PaymentDetail> getPaymentDetail(@RequestBody PaymentDetail request) {
		MaintenanceRepository maintenanceRepo = null;
		try {
			maintenanceRepo = new MaintenanceRepository();
			PaymentDetail paymentDetail = maintenanceRepo.getPaymentDetail(request.getPaymentTypeId());
			return HttpResponse.success(paymentDetail);
		} catch (Exception e) {
			LOGGER.error("Get payment detail failed. Exception occured.", e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			maintenanceRepo.dispose();
		}
	}
	
	@GetMapping("/get-email-settings")
	public HttpResponse<EmailSettings> getEmailSettings() {
		MaintenanceRepository maintenanceRepo = null;
		try {
			maintenanceRepo = new MaintenanceRepository();
			EmailSettings emailSettings = maintenanceRepo.getEmailSettings();
			if (emailSettings != null) {
				emailSettings.setPassword(CryptoUtil.decrypt(emailSettings.getPassword()));
			}
			return HttpResponse.success(emailSettings);
		} catch (Exception e) {
			LOGGER.error("Get email settings failed. Exception occured.", e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			maintenanceRepo.dispose();
		}
	}
	
	@PostMapping("/get-dg-room-master")
	public HttpResponse<DataGridResponse<RoomDetail>> getDataGridRoomMaster(@RequestBody DataGridRequest<RoomDetail> request) {
		MaintenanceRepository maintenanceRepo = null;
		try {
			maintenanceRepo = new MaintenanceRepository();
			List<RoomDetail> roomMasters = maintenanceRepo.getDataGridRoomMaster(request);
			DataGridResponse<RoomDetail> dgResponse = new DataGridResponse<RoomDetail>(roomMasters, request.getDraw(), roomMasters.size() > 0 ? roomMasters.get(0).getTotalRecords() : 0);
			return HttpResponse.success(dgResponse);
		} catch (Exception e) {
			LOGGER.error("Get room master failed. Exception occured.", e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			maintenanceRepo.dispose();
		}
	}
	
	@GetMapping("/get-room-masters")
	public HttpResponse<List<RoomDetail>> getRoomMasters() {
		MaintenanceRepository maintenanceRepo = null;
		try {
			maintenanceRepo = new MaintenanceRepository();
			List<RoomDetail> rooms = maintenanceRepo.getRoomMasters();
			return HttpResponse.success(rooms);
		} catch (Exception e) {
			LOGGER.error("Get room masters failed. Exception occured.", e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			maintenanceRepo.dispose();
		}
	}
	
	@PostMapping("/set-room-rates")
	public HttpResponse<?> setRoomRates(@RequestBody RoomDetail request) {
		MaintenanceRepository maintenanceRepo = null;
		try {
			maintenanceRepo = new MaintenanceRepository();
			maintenanceRepo.setRoomRates(request);
			return HttpResponse.success();
		} catch (Exception e) {
			LOGGER.error("Set room rates failed. Exception occured.", e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			maintenanceRepo.dispose();
		}
	}
	
	@PostMapping("/set-payment-detail")
	public HttpResponse<?> setPaymentDetail(@RequestBody PaymentDetail request) {
		MaintenanceRepository maintenanceRepo = null;
		try {
			maintenanceRepo = new MaintenanceRepository();
			maintenanceRepo.setPaymentDetail(request);
			return HttpResponse.success();
		} catch (Exception e) {
			LOGGER.error("Set payment detail failed. Exception occured.", e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			maintenanceRepo.dispose();
		}
	}
	
	@PostMapping("/set-email-settings")
	public HttpResponse<?> setEmailSettings(@RequestBody EmailSettings request) {
		MaintenanceRepository maintenanceRepo = null;
		try {
			maintenanceRepo = new MaintenanceRepository();
			maintenanceRepo.setEmailSettings(request);
			return HttpResponse.success();
		} catch (Exception e) {
			LOGGER.error("Set email settings failed. Exception occured.", e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			maintenanceRepo.dispose();
		}
	}
	
	@PostMapping("/set-room-master")
	public HttpResponse<?> setRoomMaster(@RequestBody RoomDetail request) {
		MaintenanceRepository maintenanceRepo = null;
		try {
			maintenanceRepo = new MaintenanceRepository();
			maintenanceRepo.setRoomMaster(request);
			return HttpResponse.success();
		} catch (Exception e) {
			if (!e.getMessage().contains("SPCERR:")) {
				LOGGER.error("Set room master failed. Exception occured.", e);
			}
			return HttpResponse.failed(e.getMessage());
		} finally {
			maintenanceRepo.dispose();
		}
	}

}
