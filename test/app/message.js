'use strict';
/*eslint-env node, mocha, es6 */

process.env.NODE_ENV = 'test';

const fetch = require('node-fetch');
const cheerio = require('cheerio');
const assert = require('chai').assert;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let server = require('../../bin/www');
const http = require('http');
if (!server) server = http.createServer();
//gun.wsp(server);

suite('message page', function() {
    test('check server pulse response ok', function() {
        return fetch('http://127.0.0.1:3000/message')
        .then(function(res) {
            assert.equal(res.ok, true);
            return
        })
    });
    test('post happy path unclassified', function() {
        return fetch('http://127.0.0.1:3000/message',{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: `{"message_txt": "bubblegum"}`
            })
        .then(function(res) {
            assert.equal(res.ok, true);
            return
        })
    });
    test('post happy path private key', function() {
        let privatekeystr = [
        '-----BEGIN PGP PRIVATE KEY BLOCK-----',
        'Version: GnuPG v2',
        '',
        'lQOYBFgqlVYBCAC6kSJzAJqvsh2hcnOScEJwPirTiInjzVeSrTKnF5MCnfFIL8zX',
        'OjElEDiMvoNWPh3aXZQ6MriCPkn1ECRR5O5eOm9ImTW1/y9vfbdPaU2masznwcF3',
        'bDzp43Tt5SGK+qFfZbQQOs9JYrXYhblevRElKmf+WgeUGQtYWCQQYjT0sFY2TR+u',
        '8zIXMcSY41y5wYmMq7AamfPo/9sulSSbHmxakTOYpmZIDGhEiBo7KH9rsek9ZQU9',
        'MZEyWyPUqHiWGL82F5F3yy4NK5vLUu8RaiVHrbMPrEqgkPTIIlSMo512vQ608hJa',
        'v1Ee28xP6bHdvZeVyqSUcY2Rdoexh+CQ1DOZABEBAAEAB/oCgsWF6rIqPylq7NFl',
        'XSFnxU5qPmIssKzHCpGt8gFGfb2rjQkitGPI7ej06/N0i613LN870UbuacwxAiCb',
        'AYu7tOmefoFci6ylwXlgFji3TqSnUdI6uzgupaMDOJw09J6LXCEKPuBfSnbMDTCr',
        'd7vtVh7EK44Cjju62qTRm6C+0kLUOliqRFOkUYhjxhW6pb3djPMKPBDveOfryhP7',
        'yCSetxoCDfr+GkqE901U5cI0+4bQ5u+O/o0KAfFAtSkCY98RhHb6a/WUFMMpMqhH',
        'kyv77CLEbLuqNQtXgeyJTS84zR6wiZod2SKZjrjqvhssntPFStywhhDHmQrYbjpK',
        'SegJBADUREpA8qH1j0qC2y8O+/OdTH7+lQ11dEc72kD7bpZuLagDwmxpxYYowV76',
        '5CFu5JR/B2DdTlzzKv/vHNqBdgJ0ip8gmHCIfZSnP0stSd9NyFlxpBqklRTtN/Oe',
        'WGNnA1IMrkQ7UsNtltnyw/yr9MMnRdttmIPyWQxn+t+dsFG9CwQA4QFX8bbOEfeZ',
        'Q68N2ESiPJCgny67wVjnPQX2L5mg1nPQA/a84AqRrXE3jGpyt38Qs89XCJs0+Gyo',
        'oICJjHGuih8gD6v/giOEmWuTOnSws8T0RebHm+dJqDOECEd9A18AWAoT0WLCShQa',
        'rGxIL36/HUQkC5/9e2QA7MhXXNl8kGsD/2KWGjdj9jJ9hKVxwkKZmMC10unPCfdf',
        '41UimZV6xT5enrtopj+PxCt1PKm5nEgMUDFfukJt87sRY5XLcn9dSRtPbwN9XwZD',
        'YslO6Oo1fNecM0TcHYs3CqmwwX8vW5aoc33uNns+UB+wPPHVgTLFSqPD9/zSVOnk',
        'EX+WGBtrcro9QZy0E3Rlc3RfY2xpZW50XzAwMDAwMDGJATkEEwEIACMFAlgqlVYC',
        'GwMHCwkIBwMCAQYVCAIJCgsEFgIDAQIeAQIXgAAKCRDO29wCZYLZsgzXB/48K09O',
        'gCZc9SrnsM/OOXbRcfD66bi7ivASM1VsKReN4LvOG+QhTFcoj/HxJ+EnTXqz2Xhx',
        'tUvIas33AI33Sip9XZ2Pt0klAWBjbmEiN7nMtVfgxcB5MU4XSfcvunW9I0EnoR0F',
        'lpHyMIS9mTuMVNsOz4WfK4Xy0ipRWAWcX+I+cLYFpZ41jgcECYb9SsTOWkspBMXk',
        'fGMycHisKDPGLYBrsZIuCGdL0vmGmkUlm3BGpsnDwW22ZHydwT/qUKsBeS0vouxf',
        'XTyZChpZhJeSf6usGEOH8lBbs4KmlyfXnx7lFNUZmr4STDvPCVbZ4U/zLNU3Z2xK',
        'EI2UmpPtgqlwMlzAnQOYBFgqlVYBCACz5W+7LoF/jYBH6ud5HpW2oGztQWCW5tbS',
        'm0IesiqUXanuRsBd22lOcRNwTjtIW/OjvfM5PCGknr09gOWHyp3+UX4W5VPoigA4',
        'OJjKDNqhqIyWLFHJqzE1BsrD4YmlTvbvg/f2xZk2dxVlMX3M1vwjrhSZweKEq8vW',
        'tKnMllywyMn2JAjjimqsEHUcZ5yXrm3cQl/pZRSmZXM4gUaag47koWDlojyl58tX',
        'VDAl763SzsmCj2pDYv2SMBPuAxTI6NfWmV+grkIMgg+nahZeFKVwG2hdWS1RByRG',
        'Zkx+zZ/LZ2TnDs0Zc/HZmt6zC7c+elQSBgRSvmpipiUHaW2mHpXFABEBAAEAB/kB',
        'r5SV+PrECBPxLe2LEDMlTyiQ1Uwt7djf3WOdElyyyj6VmeUjRrNHGxPXDsH1zM13',
        'izKp0SXxkH6ZLR7kNbe4UpQva75sZKAEPDI2W9t6qK/fQmgRJJZlTFHUdxsenk2o',
        'c0tSF9+hMol+oBxGh1Hn6wbiD/6VnAng0mLwT2Jr/QRdQA1WrotTOeC7/zMSP3CO',
        'r8ZKNIBECG8zwtu47kDd4kVq+OqdEq4UULuPnbbNF0rXvpwppYC6N2S05T8IlymM',
        'VWp57bqIJqP2t2DJ/YdZUXjB3ATSOaWWA8BZSV7bc2DFIIkdpn8nGlCqBQXkZXPe',
        'IvVje/suyweyyVtgtWXhBADPnL26gzIpea0hBrqiq4Y+42Asi1niYgRpzzLJspx4',
        'lxuUotVlsFnsX/QqB4WQ/kkEHFttoaXlIDSM6ZTFQixgMLkSiE9hzkY3nt3iRgee',
        'Nh4T80MJAVztigdRVyrgxYEEyn7rIjAgL3luZJ5dKqTP8nUmE7Puk40QNtoaJ/pU',
        '0QQA3dMCKWPMMte2o/V4AtYzGiXU8Qf8sGl2Z72edKhHCpMTLyfGjS+CagyAy9OM',
        'msrlh44HkG2i0ZAm6MgCzKRRkD4IQbKCq37W2t81gG2BqtMby8QlALW7Gr3CPgoW',
        's9fhssecWwukdywN8fA3Vx+1cxDXTRN3sQxaHAvvMmW2PrUD/j+oGsCaQg+c7SYc',
        'SDlrdBFCk9OW8POUrtoKr/VRj6AkxHdXkCtCDIACuAkXzl2Pu0AIaax5LiLaFc/X',
        'FabeGtE1AHtTOxa1ivBcPEwz7UvB53FJ48+vGfN/wwIxilu24mUjQTe7xj072TtR',
        'JNFh2Jg+A0vbNaorict/WZSi1CiLNG2JAR8EGAEIAAkFAlgqlVYCGwwACgkQztvc',
        'AmWC2bIDgggAo/wh++bsL0nbvwc4rRIvlq75wtJWGlW3JQ0AWe0O+FYXF7LfyjMn',
        '1Nf95jyVv0qNfb83HqFmnMhcod6sKcLBYbarjxdDiqg0tuLsuwx6zjJfHN6rxU4p',
        'WyQ9YQZtFTDUQu7z2fdbsyoxImI1nl1OWfV+AsLo+JPYzgPRExCHI51VPzQ8z/9G',
        'Eqv3PfXbn1wgsuNsqps9DJ8yJE2RcdpWba3RfL9fKDiet4Qpt9u/++e2++SMlliy',
        'kaKo0oHypvoIvX5766bGVIqGyh8DtuzmlWNvkjoTTkJ96Gn66AM1NjRVxs6aW0nd',
        'vKY0DCVIJh3lPln3y0XSF6yYtUukvOLKtw==',
        '=Ksff',
        '-----END PGP PRIVATE KEY BLOCK-----'].join("\\r\\n")
        return fetch('http://127.0.0.1:3000/message',{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: `{"message_txt": "${privatekeystr}"}`
        }).then(function(res) {
            assert.equal(res.ok, true);
            return
        })
    });
    test('post happy path pgp message', function() {
        let pgpmessagestr = [
            '-----BEGIN PGP MESSAGE-----',
            'Version: OpenPGP.js v2.3.5',
            'Comment: http://openpgpjs.org',
            '',
            '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',
            'gu+5WItNwy6CxPlf7uKSZLAZZnnoVdND8/mhOiUW9JLU9ihUdWTpvb0j+tHP',
            'ziDUiLjsbyJY7GSQl6veBXzxzGN2cw9WKystywh0dGtXIHs35A/S7/8t7+Jl',
            'kZMkz2fSsBUaudzKVqXIEEl5NAsWp2ZaTwrmjJde912gcDtWSSyot+8JKSyJ',
            'ZgHoMV1yzgxf8uZMSprtM7wFbmoNq3wVxRxrD/ubg5e51vwCkgAx8bn8pJvZ',
            'w67/LSeWjMYiDQ29dbzhsf0GHSEh+zL846IPGuF1TLFp5ubTj362alyTLCsA',
            'X61m+Oavx79lE/fy6JpZ55qk3gXlDZGgKT4K5JZCSETqiffRuqImQ6lsWyb2',
            'CqubRwm8g7Nash6OTAPdMNRzrND2m7BT4XHhnGjrmNcJlvKO5RL5Af4chKZE',
            'BcSiw/SIrFxqScC6IP/4XvowMJWBrmMzueHyAyktL4ElUzpy8FcE6m9C10WN',
            'auOSSDakqw3reNdo/nF1cZt5DIcRRvbxnbZAMP7ysSsSsXA7PSyjkwxy8m3W',
            'VXNKMAWJ/3c5bShcPiyQNihmyFfP2SGFFeQJdyHMiUruU2Ju+EEAHLD1BeYO',
            'VHR6TdcGTspLwyAYamGjO1y+gesc14ou6K8TWtTE0+6A8uIJ0RBkEGdUqUof',
            '6aU8Jh1X/PbGhi2ZaCtaeXmS/zUakGQkBCifTrxwTmbUuGXiiTNlscabopAC',
            '9y+NyQG8rUQXEKo21GRXatAnoM4FpSAeiYv3vy1d0s+C0tBXN4TiT5UpLztX',
            'zhr+ok5qak1vOjBi6qpoZFASb8w=',
            '=Gen8',
            '-----END PGP MESSAGE-----'].join("\\r\\n")
        return fetch('http://127.0.0.1:3000/message',{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: `{"message_txt": "${pgpmessagestr}"}`
        }).then(function(res) {
            assert.equal(res.ok, true);
            return
        })
    });
    test('post happy path pubkey', function() {
        let pgpPubkeyStr = [
            '-----BEGIN PGP PUBLIC KEY BLOCK-----',
            'Version: GnuPG v2',
            '',
            'mQENBFgqlVYBCAC6kSJzAJqvsh2hcnOScEJwPirTiInjzVeSrTKnF5MCnfFIL8zX',
            'OjElEDiMvoNWPh3aXZQ6MriCPkn1ECRR5O5eOm9ImTW1/y9vfbdPaU2masznwcF3',
            'bDzp43Tt5SGK+qFfZbQQOs9JYrXYhblevRElKmf+WgeUGQtYWCQQYjT0sFY2TR+u',
            '8zIXMcSY41y5wYmMq7AamfPo/9sulSSbHmxakTOYpmZIDGhEiBo7KH9rsek9ZQU9',
            'MZEyWyPUqHiWGL82F5F3yy4NK5vLUu8RaiVHrbMPrEqgkPTIIlSMo512vQ608hJa',
            'v1Ee28xP6bHdvZeVyqSUcY2Rdoexh+CQ1DOZABEBAAG0E3Rlc3RfY2xpZW50XzAw',
            'MDAwMDGJATkEEwEIACMFAlgqlVYCGwMHCwkIBwMCAQYVCAIJCgsEFgIDAQIeAQIX',
            'gAAKCRDO29wCZYLZsgzXB/48K09OgCZc9SrnsM/OOXbRcfD66bi7ivASM1VsKReN',
            '4LvOG+QhTFcoj/HxJ+EnTXqz2XhxtUvIas33AI33Sip9XZ2Pt0klAWBjbmEiN7nM',
            'tVfgxcB5MU4XSfcvunW9I0EnoR0FlpHyMIS9mTuMVNsOz4WfK4Xy0ipRWAWcX+I+',
            'cLYFpZ41jgcECYb9SsTOWkspBMXkfGMycHisKDPGLYBrsZIuCGdL0vmGmkUlm3BG',
            'psnDwW22ZHydwT/qUKsBeS0vouxfXTyZChpZhJeSf6usGEOH8lBbs4KmlyfXnx7l',
            'FNUZmr4STDvPCVbZ4U/zLNU3Z2xKEI2UmpPtgqlwMlzAuQENBFgqlVYBCACz5W+7',
            'LoF/jYBH6ud5HpW2oGztQWCW5tbSm0IesiqUXanuRsBd22lOcRNwTjtIW/OjvfM5',
            'PCGknr09gOWHyp3+UX4W5VPoigA4OJjKDNqhqIyWLFHJqzE1BsrD4YmlTvbvg/f2',
            'xZk2dxVlMX3M1vwjrhSZweKEq8vWtKnMllywyMn2JAjjimqsEHUcZ5yXrm3cQl/p',
            'ZRSmZXM4gUaag47koWDlojyl58tXVDAl763SzsmCj2pDYv2SMBPuAxTI6NfWmV+g',
            'rkIMgg+nahZeFKVwG2hdWS1RByRGZkx+zZ/LZ2TnDs0Zc/HZmt6zC7c+elQSBgRS',
            'vmpipiUHaW2mHpXFABEBAAGJAR8EGAEIAAkFAlgqlVYCGwwACgkQztvcAmWC2bID',
            'gggAo/wh++bsL0nbvwc4rRIvlq75wtJWGlW3JQ0AWe0O+FYXF7LfyjMn1Nf95jyV',
            'v0qNfb83HqFmnMhcod6sKcLBYbarjxdDiqg0tuLsuwx6zjJfHN6rxU4pWyQ9YQZt',
            'FTDUQu7z2fdbsyoxImI1nl1OWfV+AsLo+JPYzgPRExCHI51VPzQ8z/9GEqv3PfXb',
            'n1wgsuNsqps9DJ8yJE2RcdpWba3RfL9fKDiet4Qpt9u/++e2++SMlliykaKo0oHy',
            'pvoIvX5766bGVIqGyh8DtuzmlWNvkjoTTkJ96Gn66AM1NjRVxs6aW0ndvKY0DCVI',
            'Jh3lPln3y0XSF6yYtUukvOLKtw==',
            '=xC4H',
            '-----END PGP PUBLIC KEY BLOCK-----'].join("\\r\\n")
        return fetch('http://127.0.0.1:3000/message',{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: `{"message_txt": "${pgpPubkeyStr}"}`
        }).then(function(res) {
            assert.equal(res.ok, true);
            return
        })
    });
});
