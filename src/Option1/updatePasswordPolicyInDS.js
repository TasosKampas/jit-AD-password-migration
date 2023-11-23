/*
 * The contents of this file are subject to the terms of the Common Development and
 * Distribution License (the License). You may not use this file except in compliance with the
 * License.
 *
 * You can obtain a copy of the License at legal/LICENSE.md. See the License for the
 * specific language governing permission and limitations under the License.
 *
 * When distributing Covered Software, include this CDDL Header Notice in each file and include
 * the License file at legal/LICENSE.md. If applicable, add the following below the CDDL
 * Header, with the fields enclosed by brackets {{}} replaced by your own identifying
 * information: "Portions copyright {{year}} {{name_of_copyright_owner}}".
 *
 * Copyright 2022 ForgeRock AS.
 */

/*
 * Updates the Password Policy assigned to the user in DS
 */

/**
 * Node config
 */

var nodeConfig = {
    Password_Policy_DN: "ds-pwp-password-policy-dn",
  	DS_Password_Policy: "cn=Default Password Policy,cn=Password Policies,cn=config",
  	nodeName: "updatePasswordPolicyInDS"
};

/**
 * Node outcomes
 */

var nodeOutcomes = {
    TRUE: "true",
    ERROR: "error"
};

/**
 * Node imports
 */

var javaImports = JavaImporter(
    org.forgerock.openam.auth.node.api.Action
);

/**
 * Node logger
 */

var nodeLogger = {
    debug: function(message) {
        logger.message("***" + nodeConfig.nodeName + " " + message);
    },
    warning: function(message) {
        logger.warning("***" + nodeConfig.nodeName + " " + message);
    },
    error: function(message) {
        logger.error("***" + nodeConfig.nodeName + " " + message);
    }
};

/**
 * Node Main
 */

function getAction() {
  var newPasswordPolicy = nodeConfig.DS_Password_Policy;
  idRepository.setAttribute(sharedState.get("username"), nodeConfig.Password_Policy_DN, [newPasswordPolicy]);
  return javaImports.Action.goTo(nodeOutcomes.TRUE).build();
}

(function() {
    nodeLogger.error("node executing");
    action = getAction();
})();