package com.itl.mwrbs.service.threads;

import org.apache.log4j.Logger;

import com.itl.mwrbs.service.GlobalConfig;
import com.itl.mwrbs.service.repositories.CommonRepository;

public class ReservationWatcherThread implements Runnable {

	private static Logger LOGGER = Logger.getLogger(ReservationWatcherThread.class);
	
	@Override
	public void run() {
		try {
            while (GlobalConfig.getInstance().getCanContinue()) {
            	CommonRepository repo = null;
                try {
                    Thread.sleep(5000);
                    repo = new CommonRepository();
                	repo.updateAutoClosedReservation();
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
