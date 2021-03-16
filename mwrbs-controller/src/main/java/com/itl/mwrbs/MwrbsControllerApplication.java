package com.itl.mwrbs;

import org.apache.log4j.BasicConfigurator;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MwrbsControllerApplication {

	public static void main(String[] args) {
		SpringApplication.run(MwrbsControllerApplication.class, args);
		BasicConfigurator.configure();
	}

}
