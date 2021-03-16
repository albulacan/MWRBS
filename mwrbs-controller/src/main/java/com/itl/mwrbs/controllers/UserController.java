package com.itl.mwrbs.controllers;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.db.lib.utils.CryptoUtil;
import com.itl.mwrbs.models.DataGridRequest;
import com.itl.mwrbs.models.DataGridResponse;
import com.itl.mwrbs.models.HttpResponse;
import com.itl.mwrbs.models.UserDetail;
import com.itl.mwrbs.repositories.UserRepository;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/user")
public class UserController {
	
	private static final Logger LOGGER = Logger.getLogger(UserController.class);
	
	@PostMapping("/login")
	public HttpResponse<UserDetail> login(@RequestBody UserDetail request) {
		UserRepository userRepo = null;
		try {
			userRepo = new UserRepository();
			UserDetail userDetail = userRepo.authenticateUser(request.getUsername(), CryptoUtil.encrypt(request.getPassword()));
			return HttpResponse.success(userDetail);
		} catch (Exception e) {
			if (!e.getMessage().contains("SPCERR:")) {
				LOGGER.error("Login failed. Exception occured.", e);
			}
			return HttpResponse.failed(e.getMessage());
		} finally {
			userRepo.dispose();
		}
	}
	
	@PostMapping("/get-dg-user-details")
	public HttpResponse<DataGridResponse<UserDetail>> getDataGridUserDetails(@RequestBody DataGridRequest<UserDetail> request) {
		UserRepository userRepo = null;
		try {
			userRepo = new UserRepository();
			List<UserDetail> users = userRepo.getDataGridUserDetails(request);
			DataGridResponse<UserDetail> dgResponse = new DataGridResponse<UserDetail>(users, request.getDraw(), users.size() > 0 ? users.get(0).getTotalRecords() : 0);
			return HttpResponse.success(dgResponse);
		} catch (Exception e) {
			LOGGER.error("Get data grid user details failed. Exception occured.", e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			userRepo.dispose();
		}
	}
	
	@PostMapping("/enroll")
	public HttpResponse<Long> enroll(@RequestBody UserDetail request) {
		UserRepository userRepo = null;
		try {
			userRepo = new UserRepository();
			request.setPassword(CryptoUtil.encrypt(request.getPassword()));
			long userMasterId = userRepo.enrollUser(request);
			return HttpResponse.success(userMasterId);
		} catch (Exception e) {
			if (!e.getMessage().contains("SPCERR:")) {
				LOGGER.error("User enrollment failed. Exception occured.", e);
			}
			return HttpResponse.failed(e.getMessage());
		} finally {
			userRepo.dispose();
		}
	}
	
	@PostMapping("/update")
	public HttpResponse<Long> update(@RequestBody UserDetail request) {
		UserRepository userRepo = null;
		try {
			userRepo = new UserRepository();
			userRepo.updateUser(request);
			return HttpResponse.success();
		} catch (Exception e) {
			if (!e.getMessage().contains("SPCERR:")) {
				LOGGER.error("User update failed. Exception occured.", e);
			}
			return HttpResponse.failed(e.getMessage());
		} finally {
			userRepo.dispose();
		}
	}
	
	@PostMapping("/change-password")
	public HttpResponse<Long> changePassword(@RequestBody UserDetail request) {
		UserRepository userRepo = null;
		try {
			userRepo = new UserRepository();
			userRepo.setPassword(request.getUserMasterId(), CryptoUtil.encrypt(request.getOldPassword()), CryptoUtil.encrypt(request.getPassword()));
			return HttpResponse.success();
		} catch (Exception e) {
			LOGGER.error("User change password failed. Exception occured.", e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			userRepo.dispose();
		}
	}
	
	@PostMapping("/delete")
	public HttpResponse<Long> deleteUser(@RequestBody UserDetail request) {
		UserRepository userRepo = null;
		try {
			userRepo = new UserRepository();
			userRepo.deleteUser(request.getUserMasterId());
			return HttpResponse.success();
		} catch (Exception e) {
			LOGGER.error("User deletion failed. Exception occured.", e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			userRepo.dispose();
		}
	}

}
