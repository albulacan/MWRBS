package com.itl.mwrbs.service;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import org.apache.log4j.BasicConfigurator;
import org.apache.log4j.Logger;
import com.itl.mwrbs.service.threads.EmailNotificationThread;
import com.itl.mwrbs.service.threads.ReservationWatcherThread;

public class App {
	private static Logger LOGGER = Logger.getLogger(App.class);
	private static ExecutorService executor;
	
	public static void main(String[] args) {
		try {
			BasicConfigurator.configure();
			if (args == null) {
				LOGGER.info("main class invoked with NULL args.");
			} else if (args.length < 1) {
				LOGGER.info("main class invoked without args.");
			}
			String arguments = "";
			for (String arg : args) {
				arguments = String.format("%s %s", arguments, arg);
			}
			LOGGER.info("main class invoked with args : " + arguments);

			switch (arguments.trim()) {
			case "start":
				startProcess();
				break;
			case "stop":
				stopProcess();
				break;
			default:
				break;
			}
		} catch (Exception e) {
			LOGGER.error(String.format("main : %s", e));
			e.printStackTrace();
		}
	}
	
	private static void startProcess() {
		try {
			if (executor != null) {
				LOGGER.info("ExecutorService is already started.");
				return;
			}
			LOGGER.info("startProcess invoked.");
			GlobalConfig.getInstance().setCanContinue(true);
			
			executor = Executors.newFixedThreadPool(2);
			executor.execute(new EmailNotificationThread());
			executor.execute(new ReservationWatcherThread());
		} catch (Exception e) {
			LOGGER.error(String.format("startProcess : %s", e));
		}
	}
	
	private static void stopProcess() {
		try {
			if (executor == null) {
				throw new Exception("ExecutorService is null");
			} else {
				LOGGER.info("stopProcess invoked.");
				GlobalConfig.getInstance().setCanContinue(false);
				executor.shutdown();
				boolean finished = executor.awaitTermination(20, TimeUnit.SECONDS);
				if (!finished) {
					throw new Exception("ExecutorService didn't shutdown within 20 secs.");
				}
			}
		} catch (Exception e) {
			LOGGER.error(String.format("stopProcess : %s", e));
		}
	}

}
