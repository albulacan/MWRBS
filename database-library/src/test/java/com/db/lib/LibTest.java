package com.db.lib;

import org.junit.Test;

import com.db.lib.utils.CryptoUtil;

public class LibTest {

	@Test
	public void cryptoTest() {
		try {
			String originalString = "Ch3ck1t{}";
		     
		    String encryptedString = CryptoUtil.encrypt(originalString) ;
		    String decryptedString = CryptoUtil.decrypt(encryptedString) ;
		      
		    System.out.println(encryptedString);
		    System.out.println(decryptedString);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
	}
	
}
