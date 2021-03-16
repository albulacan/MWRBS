package com.itl.mwrbs.models;

import java.util.ArrayList;
import java.util.List;

public class DefaultValues {
	
	public List<PaymentType> paymentTypes;
	public List<RoomType> roomTypes;
	public List<UserType> userTypes;
	public List<RoomStatus> roomStatuses;
	public List<ReservationStatus> reservationStatuses;
	
	public DefaultValues() {
		paymentTypes = new ArrayList<PaymentType>();
		roomTypes = new ArrayList<RoomType>();
		userTypes = new ArrayList<UserType>();
		roomStatuses = new ArrayList<RoomStatus>();
		reservationStatuses = new ArrayList<ReservationStatus>();
	}

}
