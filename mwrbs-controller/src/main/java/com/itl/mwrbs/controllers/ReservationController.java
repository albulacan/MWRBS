package com.itl.mwrbs.controllers;

import java.io.File;
import java.nio.file.Files;
import java.util.List;

import org.apache.log4j.Logger;
import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.itl.mwrbs.helpers.FileUploadHelper;
import com.itl.mwrbs.models.DataGridRequest;
import com.itl.mwrbs.models.DataGridResponse;
import com.itl.mwrbs.models.HttpResponse;
import com.itl.mwrbs.models.ReservationMaster;
import com.itl.mwrbs.models.ReservationPayment;
import com.itl.mwrbs.models.RoomDetail;
import com.itl.mwrbs.repositories.ReservationRepository;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/reservation")
public class ReservationController {
	
	private static final Logger LOGGER = Logger.getLogger(ReservationController.class);
	
	@Value("${file.upload.path}")
	private String basePath;
	
	@PostMapping("/get-dg")
	public HttpResponse<DataGridResponse<ReservationMaster>> getDataGridReservations(@RequestBody DataGridRequest<ReservationMaster> request) {
		ReservationRepository reservationRepo = null;
		try {
			reservationRepo = new ReservationRepository();
			List<ReservationMaster> reservations = reservationRepo.getDataGridReservations(request);
			for (var i = 0; i < reservations.size(); i++) {
				if (reservations.get(i) != null) {
					reservations.get(i).setRoomReservationDetails(reservationRepo.getRoomReservationDetails(reservations.get(i).getReservationDetailId()));
				}
			}
			DataGridResponse<ReservationMaster> dgResponse = new DataGridResponse<ReservationMaster>(reservations, request.getDraw(), reservations.size() > 0 ? reservations.get(0).getTotalRecords() : 0);
			return HttpResponse.success(dgResponse);
		} catch (Exception e) {
			LOGGER.error("Get data grid reservations failed. Exception occured.", e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			reservationRepo.dispose();
		}
	}
	
	@PostMapping("/get-payments")
	public HttpResponse<List<ReservationPayment>> getPayments(@RequestBody ReservationPayment request) {
		ReservationRepository reservationRepo = null;
		try {
			reservationRepo = new ReservationRepository();
			List<ReservationPayment> payments = reservationRepo.getReservationPayments(request.getReservationId());
			return HttpResponse.success(payments);
		} catch (Exception e) {
			LOGGER.error("Get reservation payments failed. Exception occured.", e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			reservationRepo.dispose();
		}
	}
	
	@PostMapping("/get-reservations-by-date")
	public HttpResponse<DataGridResponse<ReservationMaster>> getReservationsByDate(@RequestBody DataGridRequest<ReservationMaster> request) {
		ReservationRepository reservationRepo = null;
		try {
			reservationRepo = new ReservationRepository();
			List<ReservationMaster> reservations = reservationRepo.getReservationsByDateRange(request);
			for (var i = 0; i < reservations.size(); i++) {
				if (reservations.get(i) != null) {
					reservations.get(i).setRoomReservationDetails(reservationRepo.getRoomReservationDetails(reservations.get(i).getReservationDetailId()));
					reservations.get(i).setPayments(reservationRepo.getReservationPayments(reservations.get(i).getReservationId()));
					reservations.get(i).setAssignedRooms(reservationRepo.getRoomAssignment(reservations.get(i).getReservationDetailId()));
				}
			}
			DataGridResponse<ReservationMaster> dgResponse = new DataGridResponse<ReservationMaster>(reservations, request.getDraw(), reservations.size() > 0 ? reservations.get(0).getTotalRecords() : 0);
			return HttpResponse.success(dgResponse);
		} catch (Exception e) {
			LOGGER.error("Get reservations by date failed. Exception occured.", e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			reservationRepo.dispose();
		}
	}
	
	@PostMapping("/get-reservation-payments-by-date")
	public HttpResponse<DataGridResponse<ReservationPayment>> getReservationPaymentsByDate(@RequestBody DataGridRequest<ReservationPayment> request) {
		ReservationRepository reservationRepo = null;
		try {
			reservationRepo = new ReservationRepository();
			List<ReservationPayment> reservations = reservationRepo.getReservationPaymentsByDateRange(request);
			DataGridResponse<ReservationPayment> dgResponse = new DataGridResponse<ReservationPayment>(reservations, request.getDraw(), reservations.size() > 0 ? reservations.get(0).getTotalRecords() : 0);
			return HttpResponse.success(dgResponse);
		} catch (Exception e) {
			LOGGER.error("Get reservation payments by date failed. Exception occured.", e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			reservationRepo.dispose();
		}
	}
	
	@PostMapping("/get-reservation-by-reference-no")
	public HttpResponse<ReservationMaster> getReservationByReferenceNo(@RequestBody ReservationMaster request) {
		ReservationRepository reservationRepo = null;
		try {
			reservationRepo = new ReservationRepository();
			ReservationMaster reservation = reservationRepo.getReservationByReferenceNo(request.getReferenceNumber());
			if (reservation != null) {
				reservation.setRoomReservationDetails(reservationRepo.getRoomReservationDetails(reservation.getReservationDetailId()));
				reservation.setPayments(reservationRepo.getReservationPayments(reservation.getReservationId()));
				reservation.setAssignedRooms(reservationRepo.getRoomAssignment(reservation.getReservationDetailId()));
			}
			return HttpResponse.success(reservation);
		} catch (Exception e) {
			LOGGER.error("Get reservation by reference number failed. Exception occured.", e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			reservationRepo.dispose();
		}
	}
	
	@GetMapping("/get-reservations")
	public HttpResponse<List<ReservationMaster>> getReservations() {
		ReservationRepository reservationRepo = null;
		try {
			reservationRepo = new ReservationRepository();
			List<ReservationMaster> reservations = reservationRepo.getReservations();
			for (var i = 0; i < reservations.size(); i++) {
				if (reservations.get(i) != null) {
					reservations.get(i).setRoomReservationDetails(reservationRepo.getRoomReservationDetails(reservations.get(i).getReservationDetailId()));
					reservations.get(i).setPayments(reservationRepo.getReservationPayments(reservations.get(i).getReservationId()));
					reservations.get(i).setAssignedRooms(reservationRepo.getRoomAssignment(reservations.get(i).getReservationDetailId()));
				}
			}
			return HttpResponse.success(reservations);
		} catch (Exception e) {
			LOGGER.error("Get reservations failed. Exception occured.", e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			reservationRepo.dispose();
		}
	}
	
	@GetMapping("/get-reservation-payments")
	public HttpResponse<List<ReservationPayment>> getReservationPayments() {
		ReservationRepository reservationRepo = null;
		try {
			reservationRepo = new ReservationRepository();
			List<ReservationPayment> payments = reservationRepo.getReservationPayments();
			return HttpResponse.success(payments);
		} catch (Exception e) {
			LOGGER.error("Get reservation reservation payments failed. Exception occured.", e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			reservationRepo.dispose();
		}
	}
	
	@PostMapping("/get-available-rooms")
	public HttpResponse<List<RoomDetail>> getAvailableRooms(@RequestBody ReservationMaster detail) {
		ReservationRepository reservationRepo = null;
		try {
			reservationRepo = new ReservationRepository();
			List<RoomDetail> rooms = reservationRepo.getAvailableRooms(detail);
			return HttpResponse.success(rooms);
		} catch (Exception e) {
			LOGGER.error("Get available rooms failed. Exception occured.", e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			reservationRepo.dispose();
		}
	}
	
	
	@PostMapping("/add")
	public HttpResponse<ReservationMaster> setReservation(@RequestBody ReservationMaster detail) {
		ReservationRepository reservationRepo = null;
		try {
			reservationRepo = new ReservationRepository();
			detail = reservationRepo.setReservationMaster(detail);
			detail.setModifiedBy("System");
			reservationRepo.setReservationStatus(detail);
			long detailId = reservationRepo.setReservationDetail(detail);
			for (var item: detail.getRoomReservationDetails()) {
				item.setReservationDetailId(detailId);
				reservationRepo.setRoomReservation(item);
			}
			if (detail.getPayments() != null && !detail.getPayments().isEmpty()) {
				for (var payment: detail.getPayments()) {
					payment.setReservationId(detail.getReservationId());
					if (!Strings.isBlank(payment.getFile())) {
						payment.setAttachmentPath(FileUploadHelper.uploadFile(detail.getReferenceNumber(),
								payment.getFile(), FileUploadHelper.getFileName(payment.getAttachmentPath()), basePath));
					}
					reservationRepo.setReservationPayment(payment);
				}
			}
			if (detail.getStatusId() == 2 && detail.getAssignedRooms() != null) {
				for (var room: detail.getAssignedRooms()) {
					room.setReservationDetailId(detailId);
					reservationRepo.setRoomAssignment(room);
				}
			}
			reservationRepo.commit();
			return HttpResponse.success(detail);
		} catch (Exception e) {
			LOGGER.error("Unable to set reservation. Exception occured.", e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			reservationRepo.dispose();
		}
	}
	
	@PostMapping("/update-detail")
	public HttpResponse<?> updateDetail(@RequestBody ReservationMaster detail) {
		ReservationRepository reservationRepo = null;
		try {
			reservationRepo = new ReservationRepository();
			long detailId = reservationRepo.setReservationDetail(detail);
			for (var item: detail.getRoomReservationDetails()) {
				item.setReservationDetailId(detailId);
				reservationRepo.setRoomReservation(item);
			}
			if (detail.getPayments() != null && !detail.getPayments().isEmpty()) {
				for (var payment: detail.getPayments()) {
					if (payment.getReservationPaymentId() == 0) {
						payment.setReservationId(detail.getReservationId());
						if (!Strings.isBlank(payment.getFile())) {
							payment.setAttachmentPath(FileUploadHelper.uploadFile(detail.getReferenceNumber(),
									payment.getFile(), FileUploadHelper.getFileName(payment.getAttachmentPath()), basePath));
						}
						reservationRepo.setReservationPayment(payment);
					}
				}
			}
			if (detail.getAssignedRooms() != null) {
				for (var room: detail.getAssignedRooms()) {
					room.setReservationDetailId(detailId);
					reservationRepo.setRoomAssignment(room);
				}
			}
			if (detail.getStatusId() == 2 && detail.getAssignedRooms() != null && !detail.getAssignedRooms().isEmpty()) {
				reservationRepo.setReservationStatus(detail);
			}
			reservationRepo.commit();
			return HttpResponse.success();
		} catch (Exception e) {
			if (!e.getMessage().contains("SPCERR:")) {
				LOGGER.error("Unable to set reservation detail. Exception occured.", e);
			}
			return HttpResponse.failed(e.getMessage());
		} finally {
			reservationRepo.dispose();
		}
	}
	
	@PostMapping("/set-payment")
	public HttpResponse<?> setReservationPayment(@RequestBody ReservationPayment detail) {
		ReservationRepository reservationRepo = null;
		try {
			reservationRepo = new ReservationRepository();
			reservationRepo.setReservationPayment(detail);
			reservationRepo.commit();
			return HttpResponse.success();
		} catch (Exception e) {
			LOGGER.error("Unable to set reservation payment. Exception occured.", e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			reservationRepo.dispose();
		}
	}
	
	@PostMapping("/set-status")
	public HttpResponse<?> setReservationStatus(@RequestBody ReservationMaster detail) {
		ReservationRepository reservationRepo = null;
		try {
			reservationRepo = new ReservationRepository();
			reservationRepo.setReservationStatus(detail);
			if (detail.getStatusId() == 2 && detail.getAssignedRooms() != null) {
				for (var room: detail.getAssignedRooms()) {
					room.setReservationDetailId(detail.getReservationDetailId());
					reservationRepo.setRoomAssignment(room);
				}
			}
			if (detail.getPayments() != null && !detail.getPayments().isEmpty()) {
				for (var payment: detail.getPayments()) {
					if (payment.getReservationPaymentId() == 0) {
						payment.setReservationId(detail.getReservationId());
						if (!Strings.isBlank(payment.getFile())) {
							payment.setAttachmentPath(FileUploadHelper.uploadFile(detail.getReferenceNumber(),
									payment.getFile(), FileUploadHelper.getFileName(payment.getAttachmentPath()), basePath));
						}
						reservationRepo.setReservationPayment(payment);
					}
				}
			}
			reservationRepo.commit();
			return HttpResponse.success();
		} catch (Exception e) {
			LOGGER.error("Unable to set reservation status. Exception occured.", e);
			return HttpResponse.failed(e.getMessage());
		} finally {
			reservationRepo.dispose();
		}
	}
	
	@PostMapping("/download-attachment")
	public byte[] downloadFile(@RequestBody ReservationPayment payment) {
		try {
			File file = new File(payment.getAttachmentPath());
			return Files.readAllBytes(file.toPath());
		} catch(Exception e) {
			LOGGER.error(String.format("Unable to download file from: %s", payment.getAttachmentPath()), e);
		}
		return null;
	}

}
