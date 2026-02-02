const { Stripe } = require("stripe");
const { COMMISSION_RATE, FRONTEND_URL } = require("../utils/constants");

class StripeService {
    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }

    async createConnectedAccount(vendor, detailsPayload) {
        const { email, businessCategory, businessSize } = detailsPayload;
        const { vendorType, storeName, fullname, phoneNumber, _id: vendorId } = vendor;

        const account = await stripe.v2.core.accounts.create({
            contact_email: email,
            contact_phone: phoneNumber,
            display_name: fullname,
            identity: {
                country: "us",
                entity_type: vendorType === "business" ? "company" : vendorType,
                business_details: {
                    registered_name: storeName,
                },
            },
            configuration: {
                merchant: {
                    capabilities: {
                        card_payments: {
                            requested: true,
                        },
                    },
                },
            },
            defaults: {
                currency: "usd",
                responsibilities: {
                    fees_collector: "stripe",
                    losses_collector: "stripe",
                },
            },
            dashboard: "full",
            include: ["configuration.merchant", "identity", "defaults"],
            metadata: {
                vendor_id: vendorId,
                commission_rate: COMMISSION_RATE + "%",
                business_category: businessCategory,
                business_size: businessSize,
            },
        });

        return account;
    }

    async getOnboardingLink(accountId) {
        const accountLink = await stripe.v2.core.accountLinks.create({
            account: accountId,
            use_case: {
                type: "account_onboarding",
                account_onboarding: {
                    configurations: ["merchant"],
                    refresh_url: FRONTEND_URL,
                    return_url: FRONTEND_URL + "/success",
                },
            },
        });

        return accountLink.url;
    }

    async makePaymentTransfer(amount, accountId) {
        const transfer = await stripe.transfers.create({
            amount: amount * 100,
            currency: "inr",
            destination: accountId,
            description: `Adding funds to ${accountId} account`,
        });

        return transfer;
    }

    async makePayout(amount, accountId) {
        const payout = await stripe.payouts.create(
            {
                amount: amount * 100,
                currency: "inr",
                method: "standard",
                description: "Payout sent",
            },
            {
                stripeAccount: accountId
            },
        );

        return payout;
    }

    async updatePayoutSchedule(accountId) {
        const balanceSettings = await stripe.balanceSettings.update(
            {
                payments: {
                    payouts: {
                        schedule: {
                            interval: "manual",
                        },
                    },
                },
            },
            {
                stripeAccount: accountId,
            },
        );

        return balanceSettings;
    }
}

module.exports = new StripeService();
