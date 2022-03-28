/*
 * Musti Backend API - User
 * All services for User service
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

package com.tarento.retail.model.contract;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

/**
 * RoleActionRequest
 */

@Getter
@Setter
public class RoleActionRequest {

	public RequestInfo getRequestInfo() {
		return requestInfo;
	}

	public void setRequestInfo(RequestInfo requestInfo) {
		this.requestInfo = requestInfo;
	}

	public RoleRequest getRoleRequest() {
		return roleRequest;
	}

	public void setRoleRequest(RoleRequest roleRequest) {
		this.roleRequest = roleRequest;
	}

	@JsonProperty("RequestInfo")
	private RequestInfo requestInfo;

	@JsonProperty("RoleRequest")
	private RoleRequest roleRequest;

}
