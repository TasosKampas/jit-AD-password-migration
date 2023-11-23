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
 * Checks the current Password Policy assigned to the user
 */

/**
 * Node config
 */

var nodeConfig = {
    Password_Policy_Attribute: "ds-pwp-password-policy-dn",
    AD_Password_Policy: "cn=AD Passthrough Authentication,cn=Password Policies,cn=config",
    DS_Password_Policy: "cn=Default Password Policy,cn=Password Policies,cn=config",
    nodeName: "checkPasswordPolicyInDS"
};

/**
 * Node outcomes
 */

var nodeOutcomes = {
    AD: "AD",
    DS: "DS",
    ERROR: "error"
};

/**
 * Node imports
 */

var javaImports = JavaImporter(
    org.forgerock.openam.auth.node.api.Action,
  	java.lang.String
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
    var PasswordPolicyDN = idRepository.getAttribute(sharedState.get("username"), nodeConfig.Password_Policy_Attribute).iterator().next();
    if (PasswordPolicyDN) {
        nodeLogger.error("PasswordPolicy's  value: " + PasswordPolicyDN);
        if (String(PasswordPolicyDN) === String(nodeConfig.AD_Password_Policy)) {
            nodeLogger.error("User uses AD LDAP Passthrough Auth Policy. Outcome is AD");
          	return javaImports.Action.goTo(nodeOutcomes.AD).build();
        } else if (String(PasswordPolicyDN) === String(nodeConfig.DS_Password_Policy)) {
            nodeLogger.error("User is on DS Password Policy. Outcome is DS");
            return javaImports.Action.goTo(nodeOutcomes.DS).build();
        } else {
          	nodeLogger.error("Something went wrong!");
            return javaImports.Action.goTo(nodeOutcomes.ERROR).build();
        }
    }
}

(function() {
    nodeLogger.error("node executing");
    action = getAction();
})();