
  var API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? ''
    : 'https://system-uf5p.onrender.com';

        function hideAllPanels() {
            ['org-profile-form','manage-accounts-view','account-notification-view','rename-tags-view','user-default-page-view','api-keys-view'].forEach(function(id) {
                var el = document.getElementById(id);
                if (el) { el.classList.remove('active'); el.style.display = ''; }
            });
            var instSel = document.querySelector('.institute-selector');
            if (instSel) instSel.style.display = '';
            // Hide all stg-sections (clears inline display:block left by openSection)
            document.querySelectorAll('.stg-section').forEach(function(sec) { sec.style.display = 'none'; });
            // Also hide the section list so it doesn't take flex space
            var dc = document.querySelector('.stg-detail-content');
            if (dc) dc.style.display = 'none';
        }
        function _showPanel(panelId, navLabel, accordionId) {
            stgHome.style.display = 'none';
            var cb = document.getElementById('stgCustomizeBtn'); if(cb) cb.style.display = 'none';
            stgDetailWrap.classList.add('show');
            stgBackBtn.classList.add('show'); var sep=document.getElementById('stgHdrSep'); if(sep) sep.style.display='';
            hideAllPanels();
            // Re-show the container so panels inside it are visible
            var dc = document.querySelector('.stg-detail-content');
            if (dc) dc.style.display = 'block';
            var p = document.getElementById(panelId);
            if (p) p.classList.add('active');
            document.querySelectorAll('.acc-item').forEach(function(i){ i.classList.remove('active'); });
            document.querySelectorAll('.acc-item').forEach(function(item){
                var lbl = item.querySelector('.acc-lbl');
                if (lbl && lbl.textContent.trim() === navLabel) item.classList.add('active');
            });
            if (accordionId) {
                var head = document.getElementById(accordionId);
                var items = document.getElementById('items-' + accordionId);
                if (head) head.classList.add('open');
                if (items) items.classList.add('open');
            }
        }
        function openOrgProfile(el) { _showPanel('org-profile-form', 'Organisation Profile', 'acc-general'); }
        function openManageAccounts() { _showPanel('manage-accounts-view', 'Manage Accounts', 'acc-general'); }
        function openAccountNotification() {
            _showPanel('account-notification-view', 'Account Notification', 'acc-general');
            var instSel = document.querySelector('.institute-selector');
            if (instSel) instSel.style.display = 'none';
            if (window.anInit) window.anInit();
        }
        function openApiKeysView() {
            _showPanel('api-keys-view', 'API Keys', 'acc-integrations');
            setTimeout(function(){ if(window.akInit) window.akInit(); }, 50);
        }
        function openUserDefaultPage() {
            _showPanel('user-default-page-view', 'User Default Page', 'acc-accsettings');
            var onbHead = document.getElementById('acc-general');
            var onbItems = document.getElementById('items-acc-general');
            if (onbHead) onbHead.classList.remove('open');
            if (onbItems) onbItems.classList.remove('open');
        }
        function openRenameTagsView() {
            _showPanel('rename-tags-view', 'Rename Tags', 'acc-accsettings');
            var onbHead = document.getElementById('acc-general');
            var onbItems = document.getElementById('items-acc-general');
            if (onbHead) onbHead.classList.remove('open');
            if (onbItems) onbItems.classList.remove('open');
        }
        function cancelToSettings() {
            hideAllPanels();
            var dc = document.querySelector('.stg-detail-content');
            if (dc) dc.style.display = 'block'; // restore for next openSection call
            stgDetailWrap.classList.remove('show');
            stgBackBtn.classList.remove('show'); var sep=document.getElementById('stgHdrSep'); if(sep) sep.style.display='none';
            stgHome.style.display = 'grid';
            var cb = document.getElementById('stgCustomizeBtn'); if(cb) cb.style.display = '';
        }
        function switchMaTab(el) {
            el.closest('.ma-tabs').querySelectorAll('.ma-tab').forEach(function(t){ t.classList.remove('active'); });
            el.classList.add('active');
        }
        function toggleRtSection(id) {
            var sec = document.getElementById(id);
            if (!sec) return;
            var isOpen = sec.classList.toggle('open');
            var ch = sec.querySelector('.rt-section-chevron');
            if (ch) ch.textContent = isOpen ? '\u2227' : '\u2228';
        }
        function rtSwitchTab(el, tabId) {
            el.closest('.rt-page-hdr').querySelectorAll('.rt-tab').forEach(function(t){ t.classList.remove('active'); });
            el.classList.add('active');
            ['rt-tab-opportunity','rt-tab-payment','rt-tab-application','rt-tab-applicant','rt-tab-institute'].forEach(function(id){
                var p = document.getElementById(id);
                if (p) p.style.display = id === tabId ? 'block' : 'none';
            });
        }
        /* mc-ch-tab styles injected via JS to keep single-file clean */
        (function(){
            var s = document.createElement('style');
            s.textContent = '.mc-ch-tab{display:inline-flex;align-items:center;gap:5px;padding:6px 13px;font-size:12.5px;font-weight:500;color:#6b7280;cursor:pointer;border-radius:20px;background:#f3f4f6;white-space:nowrap;transition:all .15s;user-select:none;border:1.5px solid transparent;}.mc-ch-tab.active{color:#fff;background:#2563eb;border-color:#2563eb;font-weight:600;box-shadow:0 2px 8px rgba(37,99,235,0.22);}.mc-ch-tab:hover:not(.active){background:#e9ebee;color:#374151;}.mc-panel-hdr{display:flex;align-items:center;gap:14px;padding:18px 24px 16px;border-bottom:1px solid #f3f4f6;}.mc-panel-icon{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:19px;flex-shrink:0;}.mc-field-row{display:flex;align-items:center;padding:14px 24px;border-bottom:1px solid #f3f4f6;gap:20px;transition:background .12s;}.mc-field-row:last-of-type{border-bottom:none;}.mc-field-row:hover{background:#fafbfd;}.mc-field-lbl{flex:0 0 230px;font-size:13px;color:#374151;font-weight:500;display:flex;align-items:flex-start;gap:5px;}.mc-field-lbl-txt{flex:1;}.mc-field-desc{font-size:11.5px;color:#9ca3af;margin-top:2px;font-weight:400;}.mc-info-badge{display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;border-radius:50%;border:1.5px solid #c4c9d4;font-size:9.5px;color:#9ca3af;cursor:default;flex-shrink:0;margin-top:1px;}.mc-input-grp{display:flex;align-items:center;border:1.5px solid #d1d5db;border-radius:8px;overflow:hidden;background:#fff;transition:border-color .15s,box-shadow .15s;width:240px;}.mc-input-grp:focus-within{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,0.1);}.mc-input-pfx,.mc-input-sfx{padding:8px 10px;background:#f9fafb;font-size:12.5px;color:#6b7280;border-right:1px solid #e9ebee;font-weight:500;white-space:nowrap;flex-shrink:0;}.mc-input-sfx{border-right:none;border-left:1px solid #e9ebee;}.mc-input-inner{flex:1;border:none;outline:none;padding:8px 10px;font-size:13px;color:#111827;font-family:inherit;background:transparent;min-width:50px;}';
            document.head.appendChild(s);
        })();
        function mcChTab(el, tabId) {
            document.querySelectorAll('#mc-ch-tabs .mc-ch-tab').forEach(function(t){ t.classList.remove('active'); });
            el.classList.add('active');
            ['mc-ch-email','mc-ch-sms','mc-ch-whatsapp','mc-ch-niaa','mc-ch-guide','mc-ch-voice','mc-ch-coach','mc-ch-license','mc-ch-limits'].forEach(function(id){
                var p = document.getElementById(id);
                if (p) p.style.display = id === tabId ? 'block' : 'none';
            });
        }
        var _mcRegions = ['+93-Afghanistan','+355-Albania','+213-Algeria','+1264-Anguilla','+61-Australia','+43-Austria','+1-Bahamas','+973-Bahrain','+880-Bangladesh','+32-Belgium','+55-Brazil','+1-Canada','+86-China','+57-Colombia','+45-Denmark','+20-Egypt','+358-Finland','+33-France','+49-Germany','+233-Ghana','+30-Greece','+852-Hong Kong','+36-Hungary','+62-Indonesia','+353-Ireland','+972-Israel','+39-Italy','+81-Japan','+962-Jordan','+254-Kenya','+82-South Korea','+965-Kuwait','+60-Malaysia','+960-Maldives','+52-Mexico','+31-Netherlands','+64-New Zealand','+234-Nigeria','+47-Norway','+968-Oman','+92-Pakistan','+63-Philippines','+48-Poland','+351-Portugal','+974-Qatar','+7-Russia','+966-Saudi Arabia','+65-Singapore','+27-South Africa','+34-Spain','+94-Sri Lanka','+46-Sweden','+41-Switzerland','+886-Taiwan','+66-Thailand','+971-UAE','+44-UK','+1-United States of America','+1268-Antigua and Barbuda','+54-Argentina'];
        var _mcAddedRegions = [];
        // Regions configured in the Pricing WA table — India always present, grows as regions are added
        var _mcWaPricingRegions = ['+91-India'];
        // Sync all feat-wa-region selects with current _mcWaPricingRegions
        function mcRefreshWaRegionSelects() {
            var opts = '<option value="">Select region\u2026</option>'
                + _mcWaPricingRegions.map(function(r) {
                    var name = r.split('-').slice(1).join('-');
                    return '<option value="' + r + '">' + name + '</option>';
                }).join('');
            document.querySelectorAll('.feat-wa-region').forEach(function(sel) {
                var cur = sel.value;
                sel.innerHTML = opts;
                if (cur) sel.value = cur; // preserve current selection
            });
            // Keep alloc table country picker in sync
            if (_mcWaPricingRegions.indexOf(_allocWaSelectedRegion) === -1 && _mcWaPricingRegions.length) {
                metsSelectWaRegion(_mcWaPricingRegions[0]);
            }
        }
        function mcToggleRegion() {
            var dd = document.getElementById('mc-region-dropdown');
            var chev = document.getElementById('mc-region-chev');
            var open = dd.style.display === 'block';
            dd.style.display = open ? 'none' : 'block';
            chev.style.transform = open ? 'rotate(0deg)' : 'rotate(180deg)';
            if (!open) { mcFilterRegions(''); document.getElementById('mc-region-search').focus(); }
        }
        function mcFilterRegions(q) {
            var list = document.getElementById('mc-region-list');
            var filtered = _mcRegions.filter(function(r){ return r.toLowerCase().indexOf(q.toLowerCase()) !== -1 && _mcAddedRegions.indexOf(r) === -1; });
            list.innerHTML = filtered.map(function(r){
                return '<div onclick="mcSelectRegion(\''+r+'\')" style="padding:9px 14px;font-size:13px;color:#374151;cursor:pointer;" onmouseover="this.style.background=\'#eff6ff\'" onmouseout="this.style.background=\'\'">'+r+'</div>';
            }).join('') || '<div style="padding:9px 14px;font-size:12.5px;color:#9ca3af;">No results</div>';
        }
        function mcSelectRegion(region) {
            document.getElementById('mc-region-label').textContent = region;
            document.getElementById('mc-region-dropdown').style.display = 'none';
            document.getElementById('mc-region-chev').style.transform = 'rotate(0deg)';
            if (_mcAddedRegions.indexOf(region) !== -1) return;
            _mcAddedRegions.push(region);
            if (_mcWaPricingRegions.indexOf(region) === -1) { _mcWaPricingRegions.push(region); mcRefreshWaRegionSelects(); }
            // Add header col
            var theadRow = document.getElementById('mc-wa-thead-row');
            var th = document.createElement('th');
            th.style.cssText = 'text-align:right;font-weight:500;color:#6b7280;padding:10px 12px;min-width:140px;white-space:nowrap;font-size:11.5px;border-bottom:1px solid #f3f4f6;';
            th.innerHTML = region + ' <span onclick="mcRemoveRegion(\''+region+'\',this)" style="cursor:pointer;color:#c4c9d4;font-weight:400;margin-left:4px;font-size:13px;line-height:1;" title="Remove">×</span>';
            th.setAttribute('data-region', region);
            theadRow.appendChild(th);
            // Add input cells to each body row with data-pricing-field for save/load
            var _waCatKeys = ['WhatsApp Service (CPS)','WhatsApp Marketing (CPS)','WhatsApp Utility (CPS)','WhatsApp Authentication (CPS)'];
            document.querySelectorAll('#mc-wa-tbody tr').forEach(function(tr, idx){
                var pricingField = _waCatKeys[idx] + ' ' + region;
                var savedVal = (_pricingSnapshot[pricingField] !== undefined) ? _pricingSnapshot[pricingField] : '0';
                var td = document.createElement('td');
                td.style.cssText = 'padding:9px 12px;border-bottom:1px solid #f3f4f6;text-align:right;';
                td.setAttribute('data-region', region);
                td.innerHTML = '<input type="number" placeholder="0" value="'+savedVal+'" data-pricing-field="'+pricingField+'" style="width:110px;border:1.5px solid #e5e7eb;border-radius:6px;padding:7px 10px;font-size:13px;color:#111827;outline:none;font-family:inherit;text-align:right;" onfocus="this.style.borderColor=\'#2563eb\'" onblur="this.style.borderColor=\'#e5e7eb\'">';
                tr.appendChild(td);
            });
        }
        function mcRemoveRegion(region, el) {
            _mcAddedRegions = _mcAddedRegions.filter(function(r){ return r !== region; });
            _mcWaPricingRegions = _mcWaPricingRegions.filter(function(r){ return r !== region; });
            mcRefreshWaRegionSelects();
            var theadRow = document.getElementById('mc-wa-thead-row');
            theadRow.querySelectorAll('[data-region="'+region+'"]').forEach(function(e){ e.remove(); });
            document.querySelectorAll('#mc-wa-tbody [data-region="'+region+'"]').forEach(function(e){ e.remove(); });
        }
        // SMS region logic
        var _smsAddedRegions = [];
        function smsToggleRegion() {
            var dd = document.getElementById('sms-region-dropdown');
            var chev = document.getElementById('sms-region-chev');
            var open = dd.style.display === 'block';
            dd.style.display = open ? 'none' : 'block';
            chev.style.transform = open ? 'rotate(0deg)' : 'rotate(180deg)';
            if (!open) { smsFilterRegions(''); document.getElementById('sms-region-search').focus(); }
        }
        function smsFilterRegions(q) {
            var list = document.getElementById('sms-region-list');
            var filtered = _mcRegions.filter(function(r){ return r.toLowerCase().indexOf(q.toLowerCase()) !== -1 && _smsAddedRegions.indexOf(r) === -1; });
            list.innerHTML = filtered.map(function(r){
                return '<div onclick="smsSelectRegion(\''+r+'\')" style="padding:9px 14px;font-size:13px;color:#374151;cursor:pointer;" onmouseover="this.style.background=\'#eff6ff\'" onmouseout="this.style.background=\'\'">'+r+'</div>';
            }).join('') || '<div style="padding:9px 14px;font-size:12.5px;color:#9ca3af;">No results</div>';
        }
        function smsSelectRegion(region) {
            document.getElementById('sms-region-label').textContent = region;
            document.getElementById('sms-region-dropdown').style.display = 'none';
            document.getElementById('sms-region-chev').style.transform = 'rotate(0deg)';
            if (_smsAddedRegions.indexOf(region) !== -1) return;
            _smsAddedRegions.push(region);
            var theadRow = document.getElementById('sms-thead-row');
            var th = document.createElement('th');
            th.style.cssText = 'text-align:right;font-weight:500;color:#6b7280;padding:10px 12px;min-width:140px;white-space:nowrap;font-size:11.5px;border-bottom:1px solid #f3f4f6;';
            th.innerHTML = region + ' <span onclick="smsRemoveRegion(\''+region+'\',this)" style="cursor:pointer;color:#c4c9d4;font-weight:400;margin-left:4px;font-size:13px;line-height:1;" title="Remove">×</span>';
            th.setAttribute('data-region', region);
            theadRow.appendChild(th);
            document.querySelectorAll('#sms-tbody tr').forEach(function(tr){
                var td = document.createElement('td');
                td.style.cssText = 'padding:9px 12px;border-bottom:1px solid #f3f4f6;text-align:right;';
                td.setAttribute('data-region', region);
                td.innerHTML = '<input type="number" placeholder="0" style="width:110px;border:1.5px solid #e5e7eb;border-radius:6px;padding:7px 10px;font-size:13px;color:#111827;outline:none;font-family:inherit;text-align:right;" onfocus="this.style.borderColor=\'#2563eb\'" onblur="this.style.borderColor=\'#e5e7eb\'">';
                tr.appendChild(td);
            });
        }
        function smsRemoveRegion(region) {
            _smsAddedRegions = _smsAddedRegions.filter(function(r){ return r !== region; });
            document.getElementById('sms-thead-row').querySelectorAll('[data-region="'+region+'"]').forEach(function(e){ e.remove(); });
            document.querySelectorAll('#sms-tbody [data-region="'+region+'"]').forEach(function(e){ e.remove(); });
        }
        // Amount Top-up accordion & type selection
        function mcToggleAccSection(bodyId, chevId) {
            var body = document.getElementById(bodyId);
            var chev = document.getElementById(chevId);
            if (!body || !chev) return;
            var open = body.style.display !== 'none';
            body.style.display = open ? 'none' : 'block';
            chev.style.transform = open ? 'rotate(0deg)' : 'rotate(180deg)';
        }
        var _mcTopupSelType = 'committed';
        var _tcTheme = {
            committed:     { border:'#5b7fa6', cardBg:'linear-gradient(150deg,#f4f7fb 0%,#e8eef6 100%)', shadow:'0 2px 8px rgba(91,127,166,0.10)', iconSel:'#5b7fa6', iconDef:'#dce6f2', iconShadow:'0 2px 8px rgba(91,127,166,0.20)', svgSel:'#fff', svgDef:'#5b7fa6', titleSel:'#3d5a7a', descSel:'#5b7fa6' },
            unallocated:   { border:'#5a8c72', cardBg:'linear-gradient(150deg,#f4f9f6 0%,#e6f2eb 100%)', shadow:'0 2px 8px rgba(90,140,114,0.10)',  iconSel:'#5a8c72', iconDef:'#d6eade', iconShadow:'0 2px 8px rgba(90,140,114,0.20)',  svgSel:'#fff', svgDef:'#5a8c72', titleSel:'#3a6050', descSel:'#5a8c72' },
            complementary: { border:'#8a72aa', cardBg:'linear-gradient(150deg,#f7f4fb 0%,#ede8f5 100%)', shadow:'0 2px 8px rgba(138,114,170,0.10)',iconSel:'#8a72aa', iconDef:'#e4ddf2', iconShadow:'0 2px 8px rgba(138,114,170,0.20)',svgSel:'#fff', svgDef:'#8a72aa', titleSel:'#5f4880', descSel:'#8a72aa' },
            testing:       { border:'#b8915a', cardBg:'linear-gradient(150deg,#faf6ef 0%,#f2e8d8 100%)', shadow:'0 2px 8px rgba(184,145,90,0.10)',  iconSel:'#b8915a', iconDef:'#f0dfc0', iconShadow:'0 2px 8px rgba(184,145,90,0.20)',  svgSel:'#fff', svgDef:'#b8915a', titleSel:'#7a5a2a', descSel:'#b8915a' }
        };
        function mcSelectTopupType(type) {
            _mcTopupSelType = type;
            ['committed','unallocated','complementary','testing'].forEach(function(t) {
                var card = document.getElementById('topupcard-' + t);
                var iconWrap = document.getElementById('tcicon-' + t);
                var radio = document.getElementById('tcradio-' + t);
                var title = document.getElementById('tctitle-' + t);
                var desc = document.getElementById('tcdesc-' + t);
                if (!card) return;
                var sel = (t === type);
                var th = _tcTheme[t];
                card.style.border = sel ? '2px solid ' + th.border : '1.5px solid #e5e7eb';
                card.style.background = sel ? th.cardBg : '#fff';
                card.style.boxShadow = sel ? th.shadow : 'none';
                if (iconWrap) {
                    iconWrap.style.background = sel ? th.iconSel : th.iconDef;
                    iconWrap.style.boxShadow = sel ? th.iconShadow : 'none';
                    var svgPaths = iconWrap.querySelectorAll('[stroke]:not([stroke="none"])');
                    svgPaths.forEach(function(el){ el.setAttribute('stroke', sel ? th.svgSel : th.svgDef); });
                }
                if (title) title.style.color = sel ? th.titleSel : '#374151';
                if (desc) desc.style.color = sel ? th.descSel : '#9ca3af';
                if (radio) {
                    radio.style.border = '2px solid ' + (sel ? th.border : '#d1d5db');
                    radio.style.background = sel ? th.border : 'transparent';
                    radio.innerHTML = sel ? '<div style="width:7px;height:7px;border-radius:50%;background:#fff;"></div>' : '';
                }
            });
            ['committed','unallocated','complementary','testing'].forEach(function(t) {
                var info = document.getElementById('topup-' + t + '-info');
                if (info) info.style.display = (t === type) ? 'flex' : 'none';
            });
            var featSec    = document.getElementById('topup-feat-rows-section');
            var compSec    = document.getElementById('topup-comp-section');
            var testSec    = document.getElementById('topup-testing-section');
            var simpleSec  = document.getElementById('topup-simple-section');
            if (featSec)   featSec.style.display   = (type === 'committed')     ? 'block' : 'none';
            if (compSec)   compSec.style.display   = (type === 'complementary') ? 'block' : 'none';
            if (testSec)   testSec.style.display   = (type === 'testing')       ? 'block' : 'none';
            if (simpleSec) simpleSec.style.display = (type === 'unallocated')   ? 'block' : 'none';
            if (type === 'complementary') {
                var compRows = document.getElementById('mc-comp-rows');
                if (compRows && compRows.children.length === 0) { _mcCompCount = 0; mcAddCompRow(); }
            } else if (type === 'testing') {
                var testRows = document.getElementById('mc-test-rows');
                if (testRows && testRows.children.length === 0) { _mcTestCount = 0; mcAddTestRow(); }
            } else if (type === 'unallocated') {
                var sinp = document.getElementById('topup-simple-inp');
                if (sinp) sinp.value = '';
            }
            // PO/TI: hidden for complementary; Notes asterisk: hidden for complementary
            var potiWrap = document.getElementById('topup-poti-wrap');
            var potiGrid = document.getElementById('topup-poti-notes-grid');
            var notesAst = document.getElementById('topup-notes-asterisk');
            var isComp   = (type === 'complementary');
            if (potiWrap) potiWrap.style.display = isComp ? 'none' : 'block';
            if (potiGrid) potiGrid.style.gridTemplateColumns = isComp ? '1fr' : '1fr 1fr';
            if (notesAst) notesAst.style.display = isComp ? 'none' : 'inline';
        }
        // ── Audit Log writer (shared by Top-up + Reversal) ──
        function mcWriteAuditLog(entry) {
            try {
                var logs = JSON.parse(localStorage.getItem('mets_audit_logs') || '[]');
                logs.unshift({
                    id: Date.now() + Math.random().toString(36).slice(2,6),
                    timestamp: new Date().toISOString(),
                    action: entry.action,
                    description: entry.description || entry.details || '',
                    details: entry.details || entry.description || '',
                    amount: entry.amount || 0,
                    reason: entry.reason || '',
                    user: entry.user || 'Admin User',
                    department: entry.department || 'Operations',
                    ip: '103.21.' + (Math.floor(Math.random()*200)+10) + '.' + (Math.floor(Math.random()*250)+1),
                    status: entry.status || 'Success'
                });
                if (logs.length > 500) logs = logs.slice(0, 500);
                localStorage.setItem('mets_audit_logs', JSON.stringify(logs));
                // Always refresh the live audit feed panel
                mcRefreshLiveAudit();
            } catch(e) {}
        }
        // Pricing key map for each feature
        var _featPricingKeys = {
            'Email': 'Email (CPM)', 'SMS': 'SMS Domestic (CPS)',
            'Niaa': 'Niaa (CPS)', 'Mio AI Guide': 'Mio AI Guide (CPS)',
            'Mio AI Voice': 'Mio AI Voice Cost Per Pulse', 'Mio AI Coach': 'Mio AI Coach (CPS)'
        };
        var _featPricingUnits = {
            'Email': '/ Email', 'SMS': '/ SMS', 'Niaa': '/ session',
            'Mio AI Guide': '/ interaction', 'Mio AI Voice': '/ pulse', 'Mio AI Coach': '/ session'
        };
        var _waCatPricingKeys = {
            service: 'WhatsApp Service (CPS)', marketing: 'WhatsApp Marketing (CPS)',
            utility: 'WhatsApp Utility (CPS)', authentication: 'WhatsApp Authentication (CPS)'
        };
        var _smsTypePricingKeys = {
            domestic: 'SMS Domestic (CPS)', international: 'SMS International (CPS)'
        };
        // Per-category colour themes (shared by row builder + toggle functions)
        var _waCatStyles = {
            service:        { color:'#2563eb', bg:'#eff6ff', border:'#bfdbfe' },
            marketing:      { color:'#d97706', bg:'#fffbeb', border:'#fde68a' },
            utility:        { color:'#7c3aed', bg:'#faf5ff', border:'#ddd6fe' },
            authentication: { color:'#059669', bg:'#f0fdf4', border:'#a7f3d0' }
        };
        var _smsTypeStyles = {
            domestic:      { color:'#2563eb', bg:'#eff6ff', border:'#bfdbfe' },
            international: { color:'#7c3aed', bg:'#faf5ff', border:'#ddd6fe' }
        };

        function mcFeatSelChange(sel, rowId) {
            var feature = sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].text : '';
            var row = document.getElementById(rowId);
            if (!row) return;
            // Guard: for simple features, reject if already selected in another row
            if (feature && feature !== 'Select feature\u2026' && feature !== 'WhatsApp' && feature !== 'SMS') {
                var duplicate = false;
                document.querySelectorAll('.mc-feat-row').forEach(function(r) {
                    if (r.id === rowId) return;
                    var s = r.querySelector('.feat-feature-sel');
                    if (s && s.selectedIndex > 0 && s.options[s.selectedIndex].text === feature) duplicate = true;
                });
                if (duplicate) {
                    sel.selectedIndex = 0;
                    sel.style.borderColor = '#ef4444';
                    sel.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.12)';
                    setTimeout(function(){ sel.style.borderColor = '#dde5f8'; sel.style.boxShadow = ''; }, 1800);
                    return;
                }
            }
            var pbar = row.querySelector('.feat-pricing-bar');
            var wasec = row.querySelector('.feat-wa-section');
            var smssec = row.querySelector('.feat-sms-section');
            if (pbar) pbar.style.display = 'none';
            if (wasec) wasec.style.display = 'none';
            if (smssec) smssec.style.display = 'none';
            if (!feature || feature === 'Select feature\u2026') return;
            if (feature === 'WhatsApp') {
                if (wasec) wasec.style.display = 'block';
                mcFeatWaCatSelect('service', rowId);
            } else if (feature === 'SMS') {
                if (smssec) smssec.style.display = 'block';
                mcFeatSmsTypeSelect('domestic', rowId);
            } else {
                mcRefreshAllRowSelections();
                var key = _featPricingKeys[feature];
                var price = key ? (_pricingSnapshot[key] || '0') : '0';
                var unit = _featPricingUnits[feature] || '';
                if (pbar) {
                    pbar.setAttribute('data-pricing-key', key || '');
                    pbar.setAttribute('data-unit', unit);
                    pbar.style.display = 'flex';
                    pbar.innerHTML =
                        '<div style="display:inline-flex;align-items:center;gap:6px;background:#f1f5fd;border:1px solid #dde5f8;border-radius:8px;padding:6px 12px;">'
                        + '<span style="font-size:11px;font-weight:700;color:#6b7280;letter-spacing:0.06em;text-transform:uppercase;">Pricing:</span>'
                        + '<span class="feat-other-price-view" style="display:flex;align-items:center;gap:5px;">'
                            + '<span class="feat-other-price" style="font-size:12.5px;font-weight:700;color:#2563eb;">' + price + ' METS ' + unit + '</span>'
                            + '<svg onclick="mcFeatOtherEditPrice(\'' + rowId + '\')" width="12" height="12" viewBox="0 0 20 20" fill="none" style="cursor:pointer;flex-shrink:0;" title="Edit pricing"><path d="M14.5 3.5l2 2L6 16H4v-2L14.5 3.5z" stroke="#9ca3af" stroke-width="1.5" stroke-linejoin="round"/></svg>'
                        + '</span>'
                        + '<span class="feat-other-price-editor" style="display:none;align-items:center;gap:5px;">'
                            + '<input class="feat-other-price-inp" type="number" step="0.01" min="0" placeholder="0" value="' + price + '" onkeydown="if(event.key===\'Enter\')mcFeatOtherSavePrice(\'' + rowId + '\')" style="width:80px;border:1.5px solid #2563eb;border-radius:6px;padding:4px 8px;font-size:12px;color:#111827;outline:none;font-family:inherit;">'
                            + '<span style="font-size:11px;color:#6b7280;white-space:nowrap;">METS ' + unit + '</span>'
                            + '<svg onclick="mcFeatOtherSavePrice(\'' + rowId + '\')" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="cursor:pointer;flex-shrink:0;" title="Save"><polyline points="20 6 9 17 4 12"/></svg>'
                            + '<svg onclick="mcFeatOtherCancelPrice(\'' + rowId + '\')" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="cursor:pointer;flex-shrink:0;" title="Cancel"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
                        + '</span>'
                        + '</div>';
                }
            }
        }

        function mcFeatOtherEditPrice(rowId) {
            var row = document.getElementById(rowId);
            if (!row) return;
            var pbar = row.querySelector('.feat-pricing-bar');
            var priceEl = pbar ? pbar.querySelector('.feat-other-price') : null;
            var cur = priceEl ? priceEl.textContent.split(' ')[0] : '0';
            var inp = pbar ? pbar.querySelector('.feat-other-price-inp') : null;
            if (inp) inp.value = cur;
            var view = pbar ? pbar.querySelector('.feat-other-price-view') : null;
            var editor = pbar ? pbar.querySelector('.feat-other-price-editor') : null;
            if (view) view.style.display = 'none';
            if (editor) editor.style.display = 'flex';
            if (inp) setTimeout(function(){ inp.focus(); inp.select(); }, 0);
        }

        async function mcFeatOtherSavePrice(rowId) {
            var row = document.getElementById(rowId);
            if (!row) return;
            var pbar = row.querySelector('.feat-pricing-bar');
            if (!pbar) return;
            var key = pbar.getAttribute('data-pricing-key');
            var unit = pbar.getAttribute('data-unit') || '';
            var inp = pbar.querySelector('.feat-other-price-inp');
            var newVal = inp ? String(parseFloat(inp.value) || 0) : '0';
            var oldVal = _pricingSnapshot[key] || '0';
            if (key && newVal !== oldVal) {
                _pricingSnapshot[key] = newVal;
                var pricingInp = document.querySelector('[data-pricing-field="' + key + '"]');
                if (pricingInp) pricingInp.value = newVal;
                fetch(API_BASE + '/api/mets/pricing-change', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ changes: [{ field: key, oldValue: oldVal, newValue: newVal }] })
                }).catch(function(){});
            }
            var priceEl = pbar.querySelector('.feat-other-price');
            if (priceEl) priceEl.textContent = (key ? (_pricingSnapshot[key] || '0') : '0') + ' METS ' + unit;
            var view = pbar.querySelector('.feat-other-price-view');
            var editor = pbar.querySelector('.feat-other-price-editor');
            if (view) view.style.display = 'flex';
            if (editor) editor.style.display = 'none';
        }

        function mcFeatOtherCancelPrice(rowId) {
            var row = document.getElementById(rowId);
            if (!row) return;
            var pbar = row.querySelector('.feat-pricing-bar');
            if (!pbar) return;
            var view = pbar.querySelector('.feat-other-price-view');
            var editor = pbar.querySelector('.feat-other-price-editor');
            if (view) view.style.display = 'flex';
            if (editor) editor.style.display = 'none';
        }

        // ── Deduplication helpers ─────────────────────────────────────────────────
        // Collect what's already selected across all committed feature rows.
        // Each key maps to an ARRAY of row IDs so duplicate selections don't
        // overwrite each other in the map.
        function mcGetUsedSelections() {
            var used = { features: {}, wa: {}, sms: {} };
            function push(map, key, id) { if (!map[key]) map[key] = []; map[key].push(id); }
            document.querySelectorAll('.mc-feat-row').forEach(function(row) {
                var sel = row.querySelector('.feat-feature-sel');
                var feature = sel && sel.selectedIndex > 0 ? sel.options[sel.selectedIndex].text : '';
                if (!feature || feature === 'Select feature\u2026') return;
                if (feature === 'WhatsApp') {
                    var rsel = row.querySelector('.feat-wa-region');
                    var acat = row.querySelector('.feat-wa-cat.fwc-active');
                    var region = rsel ? rsel.value : '';
                    var cat = acat ? acat.getAttribute('data-cat') : '';
                    if (region && cat) push(used.wa, region + '::' + cat, row.id);
                } else if (feature === 'SMS') {
                    var atype = row.querySelector('.feat-sms-type.fst-active');
                    var type = atype ? atype.getAttribute('data-type') : '';
                    if (type) push(used.sms, type, row.id);
                } else {
                    push(used.features, feature, row.id);
                }
            });
            return used;
        }

        // Returns true if the key is used by at least one row other than thisRowId
        function mcUsedByOther(list, thisRowId) {
            return (list || []).some(function(id){ return id !== thisRowId; });
        }

        // Re-render availability for every row
        function mcRefreshAllRowSelections() {
            var used = mcGetUsedSelections();
            document.querySelectorAll('.mc-feat-row').forEach(function(row) {
                var sel = row.querySelector('.feat-feature-sel');
                var feature = sel && sel.selectedIndex > 0 ? sel.options[sel.selectedIndex].text : '';

                // ── Feature dropdown: disable simple features taken by OTHER rows
                if (sel) {
                    Array.from(sel.options).forEach(function(opt) {
                        var f = opt.text;
                        if (!f || f === 'Select feature\u2026' || f === 'WhatsApp' || f === 'SMS') {
                            opt.disabled = false; return;
                        }
                        opt.disabled = mcUsedByOther(used.features[f], row.id);
                    });
                }

                // ── SMS type pills: dim types taken by OTHER rows
                if (feature === 'SMS') {
                    row.querySelectorAll('.feat-sms-type').forEach(function(pill) {
                        var t = pill.getAttribute('data-type');
                        var takenByOther = mcUsedByOther(used.sms[t], row.id);
                        pill.style.opacity = takenByOther ? '0.38' : '1';
                        pill.style.cursor  = takenByOther ? 'not-allowed' : 'pointer';
                        pill.style.pointerEvents = takenByOther ? 'none' : '';
                        pill.title = takenByOther ? 'Already used in another row' : '';
                    });
                }

                // ── WA category pills: dim region+category combos taken by OTHER rows
                if (feature === 'WhatsApp') {
                    var rsel2 = row.querySelector('.feat-wa-region');
                    var region2 = rsel2 ? rsel2.value : '';
                    row.querySelectorAll('.feat-wa-cat').forEach(function(pill) {
                        var cat = pill.getAttribute('data-cat');
                        var combo = region2 + '::' + cat;
                        var takenByOther = !!region2 && mcUsedByOther(used.wa[combo], row.id);
                        pill.style.opacity = takenByOther ? '0.38' : '1';
                        pill.style.cursor  = takenByOther ? 'not-allowed' : 'pointer';
                        pill.style.pointerEvents = takenByOther ? 'none' : '';
                        pill.title = takenByOther ? 'Already used in another row' : '';
                    });
                }
            });
        }

        function mcRemoveFeatRow(id) {
            var el = document.getElementById(id);
            if (el) el.remove();
            mcRefreshAllRowSelections();
        }
        // ─────────────────────────────────────────────────────────────────────────

        function mcFeatSmsTypeSelect(type, rowId) {
            var row = document.getElementById(rowId);
            if (!row) return;
            row.querySelectorAll('.feat-sms-type').forEach(function(p) {
                var t = p.getAttribute('data-type');
                var active = t === type;
                var sty = _smsTypeStyles[t] || { color:'#374151', bg:'#f3f4f6', border:'#e5e7eb' };
                p.style.background  = active ? sty.color : sty.bg;
                p.style.color       = active ? '#fff'    : sty.color;
                p.style.borderColor = active ? sty.color : sty.border;
                if (active) p.classList.add('fst-active'); else p.classList.remove('fst-active');
            });
            var key = _smsTypePricingKeys[type];
            var price = key ? (_pricingSnapshot[key] || '0') : '0';
            var priceEl = row.querySelector('.feat-sms-price');
            if (priceEl) priceEl.textContent = price + ' METS / SMS';
            mcFeatSmsCancelPrice(rowId);
            mcRefreshAllRowSelections();
        }

        function mcFeatSmsEditPrice(rowId) {
            var row = document.getElementById(rowId);
            if (!row) return;
            var priceEl = row.querySelector('.feat-sms-price');
            var cur = priceEl ? priceEl.textContent.split(' ')[0] : '0';
            var inp = row.querySelector('.feat-sms-price-inp');
            if (inp) inp.value = cur;
            var view = row.querySelector('.feat-sms-price-view');
            var editor = row.querySelector('.feat-sms-price-editor');
            if (view) view.style.display = 'none';
            if (editor) editor.style.display = 'flex';
            if (inp) setTimeout(function(){ inp.focus(); inp.select(); }, 0);
        }

        async function mcFeatSmsSavePrice(rowId) {
            var row = document.getElementById(rowId);
            if (!row) return;
            var inp = row.querySelector('.feat-sms-price-inp');
            var atype = row.querySelector('.feat-sms-type.fst-active');
            var type = atype ? atype.getAttribute('data-type') : 'domestic';
            var key = _smsTypePricingKeys[type];
            var newVal = inp ? String(parseFloat(inp.value) || 0) : '0';
            var oldVal = _pricingSnapshot[key] || '0';
            if (key && newVal !== oldVal) {
                _pricingSnapshot[key] = newVal;
                var pricingInp = document.querySelector('[data-pricing-field="' + key + '"]');
                if (pricingInp) pricingInp.value = newVal;
                fetch(API_BASE + '/api/mets/pricing-change', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ changes: [{ field: key, oldValue: oldVal, newValue: newVal }] })
                }).catch(function(){});
            }
            var priceEl = row.querySelector('.feat-sms-price');
            if (priceEl) priceEl.textContent = (key ? (_pricingSnapshot[key] || '0') : '0') + ' METS / SMS';
            var view = row.querySelector('.feat-sms-price-view');
            var editor = row.querySelector('.feat-sms-price-editor');
            if (view) view.style.display = 'flex';
            if (editor) editor.style.display = 'none';
        }

        function mcFeatSmsCancelPrice(rowId) {
            var row = document.getElementById(rowId);
            if (!row) return;
            var view = row.querySelector('.feat-sms-price-view');
            var editor = row.querySelector('.feat-sms-price-editor');
            if (view) view.style.display = 'flex';
            if (editor) editor.style.display = 'none';
        }

        function mcFeatWaRegionChange(sel, rowId) {
            var row = document.getElementById(rowId);
            if (!row) return;
            var activeCat = row.querySelector('.feat-wa-cat.fwc-active');
            mcFeatWaCatSelect(activeCat ? activeCat.getAttribute('data-cat') : 'service', rowId);
            mcRefreshAllRowSelections();
        }

        function mcFeatWaCatSelect(cat, rowId) {
            var row = document.getElementById(rowId);
            if (!row) return;
            row.querySelectorAll('.feat-wa-cat').forEach(function(p) {
                var c = p.getAttribute('data-cat');
                var active = c === cat;
                var sty = _waCatStyles[c] || { color:'#374151', bg:'#f3f4f6', border:'#e5e7eb' };
                p.style.background   = active ? sty.color  : sty.bg;
                p.style.color        = active ? '#fff'     : sty.color;
                p.style.borderColor  = active ? sty.color  : sty.border;
                if (active) p.classList.add('fwc-active'); else p.classList.remove('fwc-active');
            });
            var baseKey = _waCatPricingKeys[cat];
            var rsel = row.querySelector('.feat-wa-region');
            var region = rsel ? rsel.value : '';
            var regionKey = (baseKey && region) ? (baseKey + ' ' + region) : null;
            var price = regionKey && _pricingSnapshot[regionKey] !== undefined
                ? _pricingSnapshot[regionKey]
                : (baseKey ? (_pricingSnapshot[baseKey] || '0') : '0');
            var priceEl = row.querySelector('.feat-wa-price');
            if (priceEl) priceEl.textContent = price + ' METS / WhatsApp';
            // Cancel any open edit when switching category
            mcFeatWaCancelPrice(rowId);
            mcRefreshAllRowSelections();
        }

        function mcFeatWaEditPrice(rowId) {
            var row = document.getElementById(rowId);
            if (!row) return;
            var priceEl = row.querySelector('.feat-wa-price');
            var cur = priceEl ? priceEl.textContent.split(' ')[0] : '0';
            var inp = row.querySelector('.feat-wa-price-inp');
            if (inp) { inp.value = cur; }
            var view = row.querySelector('.feat-wa-price-view');
            var editor = row.querySelector('.feat-wa-price-editor');
            if (view) view.style.display = 'none';
            if (editor) { editor.style.display = 'flex'; }
            if (inp) setTimeout(function(){ inp.focus(); inp.select(); }, 0);
        }

        async function mcFeatWaSavePrice(rowId) {
            var row = document.getElementById(rowId);
            if (!row) return;
            var inp = row.querySelector('.feat-wa-price-inp');
            var acat = row.querySelector('.feat-wa-cat.fwc-active');
            var cat = acat ? acat.getAttribute('data-cat') : 'service';
            var baseKey = _waCatPricingKeys[cat];
            var rsel = row.querySelector('.feat-wa-region');
            var region = rsel ? rsel.value : '';
            var key = (baseKey && region) ? (baseKey + ' ' + region) : baseKey;
            var newVal = inp ? String(parseFloat(inp.value) || 0) : '0';
            var oldVal = _pricingSnapshot[key] || '0';
            if (key && newVal !== oldVal) {
                _pricingSnapshot[key] = newVal;
                // Update the Pricing tab input
                var pricingInp = document.querySelector('[data-pricing-field="' + key + '"]');
                if (pricingInp) pricingInp.value = newVal;
                // Persist to DB + audit log
                fetch(API_BASE + '/api/mets/pricing-change', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ changes: [{ field: key, oldValue: oldVal, newValue: newVal }] })
                }).catch(function(){});
            }
            // Refresh display and close editor
            var priceEl = row.querySelector('.feat-wa-price');
            if (priceEl) priceEl.textContent = (key ? (_pricingSnapshot[key] || '0') : '0') + ' METS / WhatsApp';
            var view = row.querySelector('.feat-wa-price-view');
            var editor = row.querySelector('.feat-wa-price-editor');
            if (view) view.style.display = 'flex';
            if (editor) editor.style.display = 'none';
        }

        function mcFeatWaCancelPrice(rowId) {
            var row = document.getElementById(rowId);
            if (!row) return;
            var view = row.querySelector('.feat-wa-price-view');
            var editor = row.querySelector('.feat-wa-price-editor');
            if (view) view.style.display = 'flex';
            if (editor) editor.style.display = 'none';
        }

        var _topupPendingBtn = null, _topupPendingFeatures = [], _topupPendingAmt = 0, _topupPendingPoti = '', _topupPendingNotes = '';

        function mcTopupConfirmClose() {
            document.getElementById('topup-confirm-overlay').style.display = 'none';
            document.getElementById('topup-confirm-modal').style.display = 'none';
            if (_topupPendingBtn) { _topupPendingBtn.textContent = 'Save'; _topupPendingBtn.disabled = false; }
            _topupPendingBtn = null;
        }

        async function mcTopupConfirmProceed() {
            var okBtn = document.getElementById('topup-confirm-ok');
            if (okBtn) { okBtn.textContent = 'Saving…'; okBtn.disabled = true; }
            try {
                var resp = await fetch(API_BASE + '/api/mets/topup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pool: _mcTopupSelType, features: _topupPendingFeatures, totalAmount: _topupPendingAmt, poti: _topupPendingPoti, notes: _topupPendingNotes })
                });
                if (!resp.ok) throw new Error('Server error');
                sessionStorage.setItem('reopenMets', '1');
                window.location.reload();
            } catch(e) {
                mcTopupConfirmClose();
                if (_topupPendingBtn) { _topupPendingBtn.textContent = 'Error'; _topupPendingBtn.style.background = '#ef4444'; }
                setTimeout(function(){ if (_topupPendingBtn) { _topupPendingBtn.textContent = 'Save'; _topupPendingBtn.style.background = '#2563eb'; _topupPendingBtn.disabled = false; } }, 2000);
            }
        }

        function mcShowTopupConfirm(btn, features, totalAmt) {
            _topupPendingBtn = btn;
            _topupPendingFeatures = features;
            _topupPendingAmt = totalAmt;

            var creditPools = { complementary: true, testing: true };
            var unit = creditPools[_mcTopupSelType] ? 'Credits' : 'METS';
            var poolLabel = (_mcTopupSelType.charAt(0).toUpperCase() + _mcTopupSelType.slice(1));
            var fmt = function(n){ return Math.round(n).toLocaleString('en-IN'); };

            var rows = features.length
                ? features.map(function(f){ return '<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #f0f2f5;">'
                    + '<span style="font-size:12.5px;color:#4b5563;">' + (f.name || 'General') + '</span>'
                    + '<span style="font-size:12.5px;font-weight:600;color:#111827;">' + fmt(f.amount) + ' <span style="font-size:11px;color:#6b7280;">' + unit + '</span></span>'
                    + '</div>'; }).join('')
                : '';
            var totalRow = '<div style="display:flex;justify-content:space-between;padding:8px 0 0;">'
                + '<span style="font-size:12px;font-weight:600;color:#374151;text-transform:uppercase;letter-spacing:0.04em;">Total</span>'
                + '<span style="font-size:14px;font-weight:700;color:#2563eb;">' + fmt(totalAmt) + ' <span style="font-size:11px;color:#6b7280;">' + unit + '</span></span>'
                + '</div>';

            var body = document.getElementById('topup-confirm-body');
            if (body) body.innerHTML = '<div style="font-size:10.5px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">' + poolLabel + ' Pool</div>'
                + rows + totalRow;

            document.getElementById('topup-confirm-overlay').style.display = 'block';
            document.getElementById('topup-confirm-modal').style.display = 'block';
            var okBtn = document.getElementById('topup-confirm-ok');
            if (okBtn) { okBtn.textContent = 'Confirm Top-up'; okBtn.disabled = false;
                okBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Confirm Top-up'; }
        }

        async function mcSubmitTopup(btn) {
            var features = [], totalAmt = 0, valid = true;

            if (_mcTopupSelType === 'complementary' || _mcTopupSelType === 'testing') {
                var rowClass = _mcTopupSelType === 'testing' ? '.mc-test-row' : '.mc-comp-row';
                var selClass = _mcTopupSelType === 'testing' ? '.test-feature-sel' : '.comp-feature-sel';
                var inpClass = _mcTopupSelType === 'testing' ? '.test-credits-inp' : '.comp-credits-inp';
                document.querySelectorAll(rowClass).forEach(function(row) {
                    var sel = row.querySelector(selClass);
                    var inp = row.querySelector(inpClass);
                    if (!sel || !inp || !(parseFloat(inp.value) > 0)) return;
                    var label = sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].text : '';
                    if (!label || label === 'Select feature\u2026') return;
                    features.push({ name: label, amount: parseFloat(inp.value) || 0 });
                    totalAmt += parseFloat(inp.value) || 0;
                });
                if (totalAmt <= 0) return;
            } else if (_mcTopupSelType === 'unallocated') {
                var sinp = document.getElementById('topup-simple-inp');
                totalAmt = parseFloat(sinp ? sinp.value : 0) || 0;
                if (totalAmt <= 0) {
                    if (sinp) {
                        sinp.style.borderColor = '#ef4444';
                        sinp.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.12)';
                        sinp.addEventListener('input', function() {
                            sinp.style.borderColor = '#e5e7eb';
                            sinp.style.boxShadow = 'none';
                        }, { once: true });
                    }
                    return;
                }
            } else {

            var featureRows = document.querySelectorAll('.mc-feat-row');
            featureRows.forEach(function(row) {
                var sel = row.querySelector('.feat-feature-sel');
                var inp = row.querySelector('.feat-mets-inp');
                if (!sel || !inp || !(parseFloat(inp.value) > 0)) return;
                var label = sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].text : '';
                if (!label || label === 'Select feature\u2026') return;
                var feat = { name: label, amount: parseFloat(inp.value) || 0 };
                if (label === 'WhatsApp') {
                    var rsel = row.querySelector('.feat-wa-region');
                    var acat = row.querySelector('.feat-wa-cat.fwc-active');
                    if (!rsel || !rsel.value) {
                        if (rsel) {
                            rsel.style.borderColor = '#ef4444';
                            rsel.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.12)';
                            rsel.addEventListener('change', function() {
                                rsel.style.borderColor = '#e5e7eb';
                                rsel.style.boxShadow = 'none';
                            }, { once: true });
                        }
                        valid = false;
                        return;
                    }
                    feat.region = rsel.value; // '+91-India' format, consistent with _mcWaPricingRegions
                    if (acat) feat.category = acat.getAttribute('data-cat');
                }
                if (label === 'SMS') {
                    var atype = row.querySelector('.feat-sms-type.fst-active');
                    if (atype) feat.smsType = atype.getAttribute('data-type');
                }
                features.push(feat);
                totalAmt += feat.amount;
            });
            if (!valid || totalAmt <= 0) return;
            } // end else (committed)

            _topupPendingPoti  = (document.getElementById('topup-poti-inp')  || {}).value || '';
            _topupPendingNotes = (document.getElementById('topup-notes-inp') || {}).value || '';

            btn.disabled = true;
            mcShowTopupConfirm(btn, features, totalAmt);
        }

        // ── Shared simple feature row builder (Complementary + Testing) ─────────
        var _mcCompCount = 0;
        var _mcTestCount = 0;

        function _mcBuildSimpleRow(prefix, count, addFn) {
            var id       = 'mc' + prefix + '-' + count;
            var rowClass = 'mc-' + prefix + '-row';
            var selClass = prefix + '-feature-sel';
            var inpClass = prefix + '-credits-inp';
            var chevron  = '<svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M5 8l5 5 5-5" stroke="#9ca3af" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            var featureOpts = '<option value="">Select feature\u2026</option>'
                + ['Email','SMS','WhatsApp','Niaa','Mio AI Guide','Mio AI Voice','Mio AI Coach'].map(function(f) {
                    return '<option value="' + f + '">' + f + '</option>';
                }).join('');
            var removeBtnHtml = count > 1
                ? '<button type="button" onclick="this.closest(\'.' + rowClass + '\').remove()" '
                +   'style="width:32px;height:32px;border-radius:8px;border:1.5px solid #fecaca;display:flex;align-items:center;justify-content:center;cursor:pointer;background:#fff;flex-shrink:0;transition:background .12s;" '
                +   'onmouseover="this.style.background=\'#fef2f2\'" onmouseout="this.style.background=\'#fff\'" title="Remove">'
                +   '<svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M5 10h10" stroke="#ef4444" stroke-width="2.2" stroke-linecap="round"/></svg>'
                + '</button>'
                : '<div style="width:32px;height:32px;"></div>';
            var wrap = document.createElement('div');
            wrap.innerHTML = '<div id="' + id + '" class="' + rowClass + '" style="display:grid;grid-template-columns:1fr 1fr 76px;gap:10px;align-items:center;">'
                +   '<div style="position:relative;">'
                +     '<select class="' + selClass + '" onchange="mcSimpleSelChange(this,\'' + rowClass + '\')" style="width:100%;border:1.5px solid #e5e7eb;border-radius:8px;padding:9px 36px 9px 12px;font-size:13px;color:#374151;outline:none;font-family:inherit;appearance:none;-webkit-appearance:none;background:#fff;cursor:pointer;transition:border-color .15s;" onfocus="this.style.borderColor=\'#2563eb\'" onblur="this.style.borderColor=\'#e5e7eb\'">'
                +       featureOpts
                +     '</select>'
                +     '<div style="position:absolute;right:10px;top:50%;transform:translateY(-50%);pointer-events:none;display:flex;align-items:center;">' + chevron + '</div>'
                +   '</div>'
                +   '<input class="' + inpClass + '" type="number" min="0" placeholder="0" style="width:100%;border:1.5px solid #e5e7eb;border-radius:8px;padding:9px 12px;font-size:13px;color:#111827;outline:none;font-family:inherit;box-sizing:border-box;transition:border-color .15s;" onfocus="this.style.borderColor=\'#2563eb\'" onblur="this.style.borderColor=\'#e5e7eb\'">'
                +   '<div style="display:flex;gap:6px;align-items:center;">'
                +     '<button type="button" onclick="' + addFn + '()" style="width:32px;height:32px;border-radius:8px;border:1.5px solid #2563eb;display:flex;align-items:center;justify-content:center;cursor:pointer;background:#fff;flex-shrink:0;transition:background .12s;" onmouseover="this.style.background=\'#eff6ff\'" onmouseout="this.style.background=\'#fff\'" title="Add row"><svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="#2563eb" stroke-width="2.2" stroke-linecap="round"/></svg></button>'
                +     removeBtnHtml
                +   '</div>'
                + '</div>';
            return wrap;
        }

        // Dedup check for Complementary / Testing simple rows
        function mcSimpleSelChange(sel, rowClass) {
            var feature = sel.selectedIndex > 0 ? sel.options[sel.selectedIndex].text : '';
            if (!feature || feature === 'Select feature\u2026') return;
            var currentRow = sel.closest('.' + rowClass);
            var duplicate = false;
            document.querySelectorAll('.' + rowClass).forEach(function(r) {
                if (r === currentRow) return;
                var s = r.querySelector('select');
                if (s && s.selectedIndex > 0 && s.options[s.selectedIndex].text === feature) duplicate = true;
            });
            if (duplicate) {
                sel.selectedIndex = 0;
                sel.style.borderColor = '#ef4444';
                sel.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.12)';
                setTimeout(function(){ sel.style.borderColor = '#e5e7eb'; sel.style.boxShadow = ''; }, 1800);
            }
        }

        function mcAddCompRow() {
            _mcCompCount++;
            document.getElementById('mc-comp-rows').appendChild(_mcBuildSimpleRow('comp', _mcCompCount, 'mcAddCompRow'));
        }

        function mcAddTestRow() {
            _mcTestCount++;
            document.getElementById('mc-test-rows').appendChild(_mcBuildSimpleRow('test', _mcTestCount, 'mcAddTestRow'));
        }

        function testingReportToggleChange(cb) {
            var knob  = document.getElementById('testing-toggle-knob');
            var track = document.getElementById('testing-toggle-track');
            var tab   = document.getElementById('tab-testing-report');
            if (cb.checked) {
                if (track) track.style.background = '#2563eb';
                if (knob)  knob.style.transform   = 'translateX(18px)';
                if (tab)   tab.style.display       = '';
            } else {
                if (track) track.style.background = '#d1d5db';
                if (knob)  knob.style.transform   = 'translateX(0px)';
                if (tab)   tab.style.display       = 'none';
                // if that tab is currently active, fall back to Allocation Details
                if (tab && tab.classList.contains('active')) {
                    var fallback = document.querySelector('.mets-tab');
                    if (fallback) fallback.click();
                }
            }
        }

        var _mcFeatCount = 0;
        function mcAddFeatureRow() {
            _mcFeatCount++;
            var id = 'mcfeat-' + _mcFeatCount;
            var container = document.getElementById('mc-feature-rows');
            var row = document.createElement('div');
            row.id = id;
            row.className = 'mc-feat-row';
            row.style.cssText = 'display:flex;flex-direction:column;padding:18px 20px;background:linear-gradient(135deg,#f8faff 0%,#f1f5fd 100%);border:1.5px solid #dde5f8;border-radius:14px;box-shadow:0 1px 4px rgba(37,99,235,0.06);';

            var regionOpts = '<option value="">Select region\u2026</option>'
                + _mcWaPricingRegions.map(function(r) {
                    var name = r.split('-').slice(1).join('-');
                    return '<option value="' + r + '">' + name + '</option>';
                }).join('');

            var _waCatCfg = {
                service:        { lbl:'Service',        color:'#2563eb', bg:'#f0f5ff', border:'#c7d7f5' },
                marketing:      { lbl:'Marketing',      color:'#8a7040', bg:'#f7f4ed', border:'#ddd0b0' },
                utility:        { lbl:'Utility',        color:'#6b5fa0', bg:'#f5f4f9', border:'#d2cce8' },
                authentication: { lbl:'Authentication', color:'#5a8a6a', bg:'#f5f8f5', border:'#d0ddd0' }
            };
            var catPills = ['service','marketing','utility','authentication'].map(function(cat) {
                var cfg = _waCatCfg[cat];
                return '<div class="feat-wa-cat" data-cat="' + cat + '" onclick="mcFeatWaCatSelect(\'' + cat + '\',\'' + id + '\')" '
                    + 'style="padding:6px 16px;border-radius:20px;font-size:12.5px;font-weight:600;cursor:pointer;'
                    + 'border:1.5px solid ' + cfg.border + ';background:' + cfg.bg + ';color:' + cfg.color + ';transition:all .15s;white-space:nowrap;">'
                    + cfg.lbl + '</div>';
            }).join('');

            row.innerHTML =
                '<div style="display:flex;align-items:flex-start;gap:12px;">'
                + '<div style="flex:1;min-width:0;">'
                    + '<div style="font-size:10.5px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Select Feature <span style="color:#ef4444;">*</span></div>'
                    + '<div style="position:relative;">'
                        + '<select class="feat-feature-sel" onchange="mcFeatSelChange(this,\'' + id + '\')" style="width:100%;border:1.5px solid #dde5f8;border-radius:9px;padding:9px 36px 9px 12px;font-size:13px;color:#111827;outline:none;font-family:inherit;background:#fff;cursor:pointer;appearance:none;-webkit-appearance:none;transition:border-color .15s;" onfocus="this.style.borderColor=\'#2563eb\'" onblur="this.style.borderColor=\'#dde5f8\'">'
                        + '<option value="">Select feature\u2026</option>'
                        + '<option>Email</option><option>SMS</option><option>WhatsApp</option><option>Niaa</option><option>Mio AI Guide</option><option>Mio AI Voice</option><option>Mio AI Coach</option>'
                        + '</select>'
                        + '<div style="position:absolute;right:11px;top:50%;transform:translateY(-50%);pointer-events:none;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg></div>'
                    + '</div>'
                    + '<div class="feat-pricing-bar" style="display:none;margin-top:6px;align-items:center;gap:5px;flex-wrap:wrap;"></div>'
                + '</div>'
                + '<div style="width:150px;flex-shrink:0;">'
                    + '<div style="font-size:10.5px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Enter METS <span style="color:#ef4444;">*</span></div>'
                    + '<input class="feat-mets-inp" type="number" placeholder="0" style="width:100%;border:1.5px solid #dde5f8;border-radius:9px;padding:9px 12px;font-size:13px;color:#111827;outline:none;font-family:inherit;box-sizing:border-box;background:#fff;transition:border-color .15s;" onfocus="this.style.borderColor=\'#2563eb\'" onblur="this.style.borderColor=\'#dde5f8\'">'
                + '</div>'
                + '<button onclick="mcRemoveFeatRow(\'' + id + '\')" style="width:30px;height:30px;flex-shrink:0;border:none;border-radius:50%;background:#fee2e2;color:#ef4444;cursor:pointer;font-size:17px;line-height:1;padding:0;font-family:inherit;margin-top:22px;transition:background .12s;" onmouseover="this.style.background=\'#fecaca\'" onmouseout="this.style.background=\'#fee2e2\'">\u00d7</button>'
                + '</div>'
                // SMS Domestic / International section
                + '<div class="feat-sms-section" style="display:none;margin-top:16px;border-top:1px solid #e8edf8;padding-top:14px;">'
                    + '<div class="feat-sms-types" style="display:flex;gap:8px;margin-bottom:12px;">'
                        + ['domestic','international'].map(function(t) {
                            var lbl = t === 'domestic' ? 'Domestic' : 'International';
                            var col = t === 'domestic' ? '#2563eb' : '#7c3aed';
                            var bg  = t === 'domestic' ? '#eff6ff'  : '#faf5ff';
                            var bdr = t === 'domestic' ? '#bfdbfe'  : '#ddd6fe';
                            return '<div class="feat-sms-type" data-type="' + t + '" onclick="mcFeatSmsTypeSelect(\'' + t + '\',\'' + id + '\')" '
                                + 'style="padding:6px 16px;border-radius:20px;font-size:12.5px;font-weight:600;cursor:pointer;border:1.5px solid ' + bdr + ';background:' + bg + ';color:' + col + ';transition:all .15s;">'
                                + lbl + '</div>';
                        }).join('')
                    + '</div>'
                    + '<div style="display:inline-flex;align-items:center;gap:6px;background:#f1f5fd;border:1px solid #dde5f8;border-radius:8px;padding:6px 12px;">'
                        + '<span style="font-size:11px;font-weight:700;color:#6b7280;letter-spacing:0.06em;text-transform:uppercase;">Pricing:</span>'
                        + '<span class="feat-sms-price-view" style="display:flex;align-items:center;gap:5px;">'
                            + '<span class="feat-sms-price" style="font-size:12.5px;font-weight:700;color:#2563eb;">0 METS / SMS</span>'
                            + '<svg onclick="mcFeatSmsEditPrice(\'' + id + '\')" width="12" height="12" viewBox="0 0 20 20" fill="none" style="cursor:pointer;flex-shrink:0;" title="Edit pricing"><path d="M14.5 3.5l2 2L6 16H4v-2L14.5 3.5z" stroke="#9ca3af" stroke-width="1.5" stroke-linejoin="round"/></svg>'
                        + '</span>'
                        + '<span class="feat-sms-price-editor" style="display:none;align-items:center;gap:5px;">'
                            + '<input class="feat-sms-price-inp" type="number" step="0.01" min="0" placeholder="0" onkeydown="if(event.key===\'Enter\')mcFeatSmsSavePrice(\'' + id + '\')" style="width:80px;border:1.5px solid #2563eb;border-radius:6px;padding:4px 8px;font-size:12px;color:#111827;outline:none;font-family:inherit;">'
                            + '<span style="font-size:11px;color:#6b7280;white-space:nowrap;">METS / SMS</span>'
                            + '<svg onclick="mcFeatSmsSavePrice(\'' + id + '\')" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="cursor:pointer;flex-shrink:0;" title="Save"><polyline points="20 6 9 17 4 12"/></svg>'
                            + '<svg onclick="mcFeatSmsCancelPrice(\'' + id + '\')" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="cursor:pointer;flex-shrink:0;" title="Cancel"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
                        + '</span>'
                    + '</div>'
                + '</div>'
                // WhatsApp region + category section
                + '<div class="feat-wa-section" style="display:none;margin-top:16px;border-top:1px solid #e8edf8;padding-top:16px;">'
                    + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">'
                        + '<div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">'
                            + '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
                            + '<span style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;white-space:nowrap;">Region</span>'
                        + '</div>'
                        + '<div style="position:relative;flex:1;max-width:240px;">'
                            + '<select class="feat-wa-region" onchange="mcFeatWaRegionChange(this,\'' + id + '\')" style="width:100%;border:1.5px solid #dde5f8;border-radius:9px;padding:8px 34px 8px 12px;font-size:13px;color:#111827;outline:none;font-family:inherit;background:#fff;cursor:pointer;appearance:none;-webkit-appearance:none;transition:border-color .15s;" onfocus="this.style.borderColor=\'#2563eb\'" onblur="this.style.borderColor=\'#dde5f8\'">'
                            + regionOpts
                            + '</select>'
                            + '<div style="position:absolute;right:10px;top:50%;transform:translateY(-50%);pointer-events:none;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg></div>'
                        + '</div>'
                    + '</div>'
                    + '<div class="feat-wa-cats" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;">' + catPills + '</div>'
                    + '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">'
                        + '<div style="display:inline-flex;align-items:center;gap:6px;background:#f1f5fd;border:1px solid #dde5f8;border-radius:8px;padding:6px 12px;">'
                            + '<span style="font-size:11px;font-weight:700;color:#6b7280;letter-spacing:0.06em;text-transform:uppercase;">Pricing:</span>'
                            // View mode
                            + '<span class="feat-wa-price-view" style="display:flex;align-items:center;gap:5px;">'
                                + '<span class="feat-wa-price" style="font-size:12.5px;font-weight:700;color:#2563eb;">0 METS / WhatsApp</span>'
                                + '<svg class="feat-wa-price-edit-btn" onclick="mcFeatWaEditPrice(\'' + id + '\')" width="12" height="12" viewBox="0 0 20 20" fill="none" style="cursor:pointer;flex-shrink:0;" title="Edit pricing"><path d="M14.5 3.5l2 2L6 16H4v-2L14.5 3.5z" stroke="#9ca3af" stroke-width="1.5" stroke-linejoin="round"/></svg>'
                            + '</span>'
                            // Edit mode
                            + '<span class="feat-wa-price-editor" style="display:none;align-items:center;gap:5px;">'
                                + '<input class="feat-wa-price-inp" type="number" step="0.01" min="0" placeholder="0" onkeydown="if(event.key===\'Enter\')mcFeatWaSavePrice(\'' + id + '\')" style="width:80px;border:1.5px solid #2563eb;border-radius:6px;padding:4px 8px;font-size:12px;color:#111827;outline:none;font-family:inherit;">'
                                + '<span style="font-size:11px;color:#6b7280;white-space:nowrap;">METS / WhatsApp</span>'
                                + '<svg onclick="mcFeatWaSavePrice(\'' + id + '\')" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="cursor:pointer;flex-shrink:0;" title="Save"><polyline points="20 6 9 17 4 12"/></svg>'
                                + '<svg onclick="mcFeatWaCancelPrice(\'' + id + '\')" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="cursor:pointer;flex-shrink:0;" title="Cancel"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
                            + '</span>'
                        + '</div>'
                        + '<span style="font-size:11px;color:#9ca3af;font-style:italic;">\u002a Rates vary by region &amp; category</span>'
                    + '</div>'
                + '</div>';

            container.appendChild(row);
        }
        document.addEventListener('click', function(e){
            var wrap = document.getElementById('mc-region-wrap');
            if (wrap && !wrap.contains(e.target)) {
                var dd = document.getElementById('mc-region-dropdown');
                if (dd) { dd.style.display = 'none'; document.getElementById('mc-region-chev').style.transform = 'rotate(0deg)'; }
            }
            var swrap = document.getElementById('sms-region-wrap');
            if (swrap && !swrap.contains(e.target)) {
                var sdd = document.getElementById('sms-region-dropdown');
                if (sdd) { sdd.style.display = 'none'; document.getElementById('sms-region-chev').style.transform = 'rotate(0deg)'; }
            }
        });
        function mcSwitchTab(el, tabId) {
            el.closest('.rt-page-hdr').querySelectorAll('.rt-tab').forEach(function(t){ t.classList.remove('active'); });
            el.classList.add('active');
            ['mc-tab-topup','mc-tab-pricing','mc-tab-reversal','mc-tab-feat-avail'].forEach(function(id){
                var p = document.getElementById(id);
                if (p) p.style.display = id === tabId ? 'block' : 'none';
            });
        }

        function lbfaToggle(cb) { /* state handled by CSS :checked */ }

        function lbfaSave(btn) {
            var orig = btn.textContent;
            btn.textContent = 'Saving…';
            btn.disabled = true;
            setTimeout(function() {
                btn.textContent = '✓ Saved';
                btn.style.background = '#16a34a';
                setTimeout(function() {
                    btn.textContent = orig;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 1800);
            }, 600);
        }

        // Snapshot of last-saved pricing values keyed by data-pricing-field
        var _pricingSnapshot = {};
        // Base WA keys — used to detect region-specific pricing keys in DB
        var _waBaseKeys = ['WhatsApp Service (CPS)','WhatsApp Marketing (CPS)','WhatsApp Utility (CPS)','WhatsApp Authentication (CPS)'];
        function metsLoadPricing() {
            fetch(API_BASE + '/api/mets/pricing')
                .then(function(r){ return r.json(); })
                .then(function(data) {
                    // Store ALL keys from DB so dynamically-added region columns get correct saved values
                    Object.keys(data).forEach(function(field) {
                        _pricingSnapshot[field] = data[field];
                    });
                    // Populate existing DOM inputs
                    document.querySelectorAll('[data-pricing-field]').forEach(function(inp) {
                        var field = inp.getAttribute('data-pricing-field');
                        if (data[field] !== undefined) {
                            inp.value = data[field];
                        } else {
                            _pricingSnapshot[field] = inp.value;
                        }
                    });
                    // Restore region columns that were saved in a previous session
                    var restoredRegions = [];
                    Object.keys(data).forEach(function(field) {
                        for (var i = 0; i < _waBaseKeys.length; i++) {
                            var base = _waBaseKeys[i];
                            if (field.indexOf(base + ' ') === 0) {
                                var region = field.slice(base.length + 1);
                                if (region && restoredRegions.indexOf(region) === -1 && _mcAddedRegions.indexOf(region) === -1 && region !== '+91-India') {
                                    restoredRegions.push(region);
                                    mcSelectRegion(region);
                                }
                                break;
                            }
                        }
                    });
                    mcRefreshWaRegionSelects();
                    metsRenderAlloc();
                })
                .catch(function() {
                    // fallback: snapshot current DOM values
                    document.querySelectorAll('[data-pricing-field]').forEach(function(inp) {
                        _pricingSnapshot[inp.getAttribute('data-pricing-field')] = inp.value;
                    });
                });
        }
        document.addEventListener('DOMContentLoaded', metsLoadPricing);

        // ── Allocation table — WhatsApp country picker ─────────────────────────
        var _allocWaSelectedRegion = '+91-India';

        var _countryFlags = { '+91': '🇮🇳', '+1': '🇺🇸', '+44': '🇬🇧', '+971': '🇦🇪', '+65': '🇸🇬', '+60': '🇲🇾', '+61': '🇦🇺', '+49': '🇩🇪', '+33': '🇫🇷', '+81': '🇯🇵', '+82': '🇰🇷', '+86': '🇨🇳', '+55': '🇧🇷', '+7': '🇷🇺', '+27': '🇿🇦', '+234': '🇳🇬', '+254': '🇰🇪', '+92': '🇵🇰', '+880': '🇧🇩', '+94': '🇱🇰' };
        function metsWaRegionFlag(region) {
            var code = region.split('-')[0]; // e.g. '+91'
            return _countryFlags[code] || '🌐';
        }
        function metsWaRegionName(region) {
            return region.includes('-') ? region.split('-').slice(1).join('-') : region;
        }

        function metsToggleWaCountryDd(e) {
            e.stopPropagation();
            var dd = document.getElementById('alloc-wa-country-dd');
            if (!dd) return;
            if (dd.style.display !== 'none') { dd.style.display = 'none'; return; }
            dd.innerHTML = _mcWaPricingRegions.map(function(r) {
                var active = r === _allocWaSelectedRegion;
                return '<div onclick="metsSelectWaRegion(\'' + r + '\')" '
                    + 'style="display:flex;align-items:center;gap:7px;padding:8px 14px;font-size:12.5px;cursor:pointer;white-space:nowrap;'
                    + 'color:' + (active ? '#2563eb' : '#374151') + ';font-weight:' + (active ? '600' : '400') + ';background:' + (active ? '#f0f5ff' : '') + ';" '
                    + 'onmouseover="this.style.background=\'#f0f5ff\'" onmouseout="this.style.background=\'' + (active ? '#f0f5ff' : '') + '\'">'
                    + '<span style="font-size:15px;line-height:1;">' + metsWaRegionFlag(r) + '</span>'
                    + '<span>' + metsWaRegionName(r) + '</span>'
                    + (active ? '<svg style="margin-left:auto;" width="11" height="11" viewBox="0 0 20 20" fill="none"><polyline points="4 10 8 14 16 6" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : '')
                    + '</div>';
            }).join('');
            dd.style.display = 'block';
        }
        function metsSelectWaRegion(region) {
            _allocWaSelectedRegion = region;
            var label = document.getElementById('alloc-wa-country-label');
            if (label) label.textContent = metsWaRegionFlag(region) + ' ' + metsWaRegionName(region);
            var dd = document.getElementById('alloc-wa-country-dd');
            if (dd) dd.style.display = 'none';
            metsRenderAlloc();
        }
        document.addEventListener('click', function() {
            var dd = document.getElementById('alloc-wa-country-dd');
            if (dd) dd.style.display = 'none';
        });

        // ── Allocation Details table — live data renderer ──────────────────────
        function metsRenderAlloc() {
            var fmtMets = function(n) {
                if (!n && n !== 0) return '—';
                var parts = Number(n).toLocaleString('en-IN', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).split('.');
                return parts[0] + '<span class="mets-decimal">.' + (parts[1] || '000') + '</span>';
            };
            var fmtPlain = function(n) {
                if (!n && n !== 0) return '—';
                return Math.round(n).toLocaleString('en-IN');
            };
            var setHtml = function(id, html) { var el = document.getElementById(id); if (el) el.innerHTML = html; };
            var setText = function(id, txt) { var el = document.getElementById(id); if (el) el.textContent = txt; };

            // ── Email ──
            var emailCommitted = (_revBalances.committed   && _revBalances.committed.channels)   ? (_revBalances.committed.channels.email   || 0) : 0;
            var emailAllocated = (_revBalances.allocated   && _revBalances.allocated.channels)   ? (_revBalances.allocated.channels.email   || 0) : 0;
            var emailComp      = (_revBalances.complementary && _revBalances.complementary.channels) ? (_revBalances.complementary.channels.email || 0) : 0;
            var emailTesting   = (_revBalances.testing       && _revBalances.testing.channels)       ? (_revBalances.testing.channels.email       || 0) : 0;
            var emailCpu       = parseFloat(_pricingSnapshot['Email (CPM)'] || '0') || 0;
            var emailCredits   = Math.floor(emailCpu > 0 ? ((emailCommitted + emailAllocated) / emailCpu) + emailComp + emailTesting : emailComp + emailTesting);

            setHtml('alloc-email-committed', fmtMets(emailCommitted));
            setHtml('alloc-email-allocated', fmtMets(emailAllocated));
            setText('alloc-email-cpu',       emailCpu > 0 ? String(emailCpu) : '—');
            setText('alloc-email-comp',      fmtPlain(emailComp));
            setHtml('alloc-email-credits',   fmtMets(emailCredits));
            setHtml('alloc-email-avg',       fmtMets(0));

            // ── SMS ──
            var smsAllocated = (_revBalances.allocated    && _revBalances.allocated.channels)    ? (_revBalances.allocated.channels.sms    || 0) : 0;
            var smsComp      = (_revBalances.complementary && _revBalances.complementary.channels) ? (_revBalances.complementary.channels.sms || 0) : 0;
            var smsTesting   = (_revBalances.testing       && _revBalances.testing.channels)       ? (_revBalances.testing.channels.sms       || 0) : 0;

            var smsDomCommitted  = (_smsByType.committed  && _smsByType.committed.domestic)      ? _smsByType.committed.domestic      : 0;
            var smsIntlCommitted = (_smsByType.committed  && _smsByType.committed.international)  ? _smsByType.committed.international  : 0;

            var smsDomCpu  = parseFloat(_pricingSnapshot['SMS Domestic (CPS)']      || '0') || 0;
            var smsIntlCpu = parseFloat(_pricingSnapshot['SMS International (CPS)'] || '0') || 0;

            var smsDomCredits  = Math.floor(smsDomCpu  > 0 ? ((smsDomCommitted  + smsAllocated) / smsDomCpu)  + smsComp + smsTesting : smsComp + smsTesting);
            var smsIntlCredits = Math.floor(smsIntlCpu > 0 ? ((smsIntlCommitted + smsAllocated) / smsIntlCpu) + smsComp + smsTesting : smsComp + smsTesting);

            // Shared cells (feature-level, same for both categories)
            setHtml('alloc-sms-allocated', fmtMets(smsAllocated));
            setText('alloc-sms-comp',      fmtPlain(smsComp));

            // Domestic row
            setHtml('alloc-sms-domestic-committed', fmtMets(smsDomCommitted));
            setText('alloc-sms-domestic-cpu',       smsDomCpu > 0 ? String(smsDomCpu) : '—');
            setHtml('alloc-sms-domestic-credits',   fmtMets(smsDomCredits));
            setHtml('alloc-sms-domestic-avg',       fmtMets(0));

            // International row
            setHtml('alloc-sms-intl-committed', fmtMets(smsIntlCommitted));
            setText('alloc-sms-intl-cpu',       smsIntlCpu > 0 ? String(smsIntlCpu) : '—');
            setHtml('alloc-sms-intl-credits',   fmtMets(smsIntlCredits));
            setHtml('alloc-sms-intl-avg',       fmtMets(0));

            // ── WhatsApp ──
            var waAllocated = (_revBalances.allocated    && _revBalances.allocated.channels)    ? (_revBalances.allocated.channels.whatsapp    || 0) : 0;
            var waComp      = (_revBalances.complementary && _revBalances.complementary.channels) ? (_revBalances.complementary.channels.whatsapp || 0) : 0;
            var waTesting   = (_revBalances.testing       && _revBalances.testing.channels)       ? (_revBalances.testing.channels.whatsapp       || 0) : 0;

            // Sum committed METS across all regions per category
            var WA_CATS = ['utility', 'service', 'marketing', 'authentication'];
            var waCpuKeys = {
                utility:        'WhatsApp Utility (CPS)',
                service:        'WhatsApp Service (CPS)',
                marketing:      'WhatsApp Marketing (CPS)',
                authentication: 'WhatsApp Authentication (CPS)'
            };

            // Helper: sum committed for a given category, filtered by selected region
            var waCommittedByCat = function(cat) {
                var total = 0;
                Object.keys(_waByRegionCat).forEach(function(pool) {
                    var poolData = _waByRegionCat[pool];
                    if (_allocWaSelectedRegion) {
                        total += (poolData[_allocWaSelectedRegion] && poolData[_allocWaSelectedRegion][cat]) || 0;
                    } else {
                        Object.keys(poolData).forEach(function(region) {
                            total += poolData[region][cat] || 0;
                        });
                    }
                });
                return total;
            };

            // Shared cells
            setHtml('alloc-wa-allocated', fmtMets(waAllocated));
            setText('alloc-wa-comp',      fmtPlain(waComp));

            // Per-category rows
            WA_CATS.forEach(function(cat) {
                var committed = waCommittedByCat(cat);
                var cpu       = parseFloat(_pricingSnapshot[waCpuKeys[cat]] || '0') || 0;
                var credits   = Math.floor(cpu > 0 ? ((committed + waAllocated) / cpu) + waComp + waTesting : waComp + waTesting);

                setHtml('alloc-wa-' + cat + '-committed', fmtMets(committed));
                setText('alloc-wa-' + cat + '-cpu',       cpu > 0 ? String(cpu) : '—');
                setHtml('alloc-wa-' + cat + '-credits',   fmtMets(credits));
                setHtml('alloc-wa-' + cat + '-avg',       fmtMets(0));
            });

            // ── Helper: render one email-style channel row ──────────────────
            var renderSimpleRow = function(ch, pricingKey, prefix) {
                var committed = (_revBalances.committed    && _revBalances.committed.channels)    ? (_revBalances.committed.channels[ch]    || 0) : 0;
                var allocated = (_revBalances.allocated    && _revBalances.allocated.channels)    ? (_revBalances.allocated.channels[ch]    || 0) : 0;
                var comp      = (_revBalances.complementary && _revBalances.complementary.channels) ? (_revBalances.complementary.channels[ch] || 0) : 0;
                var testing   = (_revBalances.testing       && _revBalances.testing.channels)       ? (_revBalances.testing.channels[ch]       || 0) : 0;
                var cpu       = parseFloat(_pricingSnapshot[pricingKey] || '0') || 0;
                var credits   = Math.floor(cpu > 0 ? ((committed + allocated) / cpu) + comp + testing : comp + testing);

                setHtml(prefix + '-committed', fmtMets(committed));
                setHtml(prefix + '-allocated', fmtMets(allocated));
                setText(prefix + '-cpu',       cpu > 0 ? String(cpu) : '—');
                setText(prefix + '-comp',      fmtPlain(comp));
                setHtml(prefix + '-credits',   fmtMets(credits));
                setHtml(prefix + '-avg',       fmtMets(0));
            };

            // ── Niaa ──
            renderSimpleRow('niaa',  'Niaa (CPS)',                   'alloc-niaa');
            // ── Mio AI Guide ──
            renderSimpleRow('guide', 'Mio AI Guide (CPS)',           'alloc-guide');
            // ── Mio AI Voice (Cost Per Pulse) ──
            renderSimpleRow('voice', 'Mio AI Voice Cost Per Pulse',  'alloc-voice');
            // ── Mio AI Coach ──
            renderSimpleRow('coach', 'Mio AI Coach (CPS)',           'alloc-coach');
        }

        async function mcSavePricing(btn) {
            var changes = [];
            document.querySelectorAll('[data-pricing-field]').forEach(function(inp) {
                var field = inp.getAttribute('data-pricing-field');
                var newVal = inp.value;
                var oldVal = _pricingSnapshot[field] !== undefined ? _pricingSnapshot[field] : '';
                if (newVal !== oldVal) {
                    changes.push({ field: field, oldValue: oldVal, newValue: newVal });
                }
            });

            if (!changes.length) {
                btn.textContent = 'No changes';
                setTimeout(function(){ btn.textContent = 'Save Changes'; }, 1500);
                return;
            }

            btn.textContent = 'Saving\u2026';
            btn.disabled = true;
            try {
                await fetch(API_BASE + '/api/mets/pricing-change', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ changes: changes })
                });
                // Update snapshot after successful save
                changes.forEach(function(c) { _pricingSnapshot[c.field] = c.newValue; });
                btn.textContent = 'Saved \u2713';
                btn.style.background = '#059669';
                setTimeout(function(){ btn.textContent = 'Save Changes'; btn.style.background = ''; btn.disabled = false; }, 2000);
            } catch(e) {
                btn.textContent = 'Error';
                btn.style.background = '#ef4444';
                setTimeout(function(){ btn.textContent = 'Save Changes'; btn.style.background = ''; btn.disabled = false; }, 2000);
            }
        }
        // ── Live Audit Feed ──
        function mcRefreshLiveAudit() {
            var all = [];
            try { all = JSON.parse(localStorage.getItem('mets_audit_logs') || '[]'); } catch(e) {}
            var q = ((document.getElementById('mc-audit-search') || {}).value || '').toLowerCase();
            var filtered = q ? all.filter(function(l){
                return [l.action, l.description, l.details, l.reason, l.user, l.department].join(' ').toLowerCase().indexOf(q) !== -1;
            }) : all;
            var live = document.getElementById('mc-audit-live');
            var empty = document.getElementById('mc-audit-empty');
            var cnt = document.getElementById('mc-audit-count');
            if (cnt) cnt.textContent = filtered.length + ' record' + (filtered.length !== 1 ? 's' : '');
            if (!filtered.length) {
                if (live) live.innerHTML = '';
                if (empty) empty.style.display = 'flex';
                return;
            }
            if (empty) empty.style.display = 'none';
            var dotColors = {'METS Top-up':'#2563eb','METS Deduction':'#ef4444','METS Reversal':'#ef4444','Pricing Change':'#7c3aed'};
            var badgeColors = {'METS Top-up':{bg:'#eff6ff',c:'#2563eb'},'METS Deduction':{bg:'#fef2f2',c:'#ef4444'},'METS Reversal':{bg:'#fef2f2',c:'#ef4444'},'Pricing Change':{bg:'#f5f3ff',c:'#7c3aed'}};
            live.innerHTML = '<div style="position:relative;padding-left:20px;border-left:2px solid #e5e7eb;">'
                + filtered.map(function(l) {
                    var d = new Date(l.timestamp);
                    var dateStr = d.toLocaleDateString('en-IN', {day:'2-digit',month:'2-digit',year:'numeric'});
                    var timeStr = d.toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit',hour12:true});
                    var dot = dotColors[l.action] || '#6b7280';
                    var badge = badgeColors[l.action] || {bg:'#f3f4f6',c:'#374151'};
                    var desc = l.description || l.details || '';
                    var user = l.user || 'Admin User';
                    var dept = l.department || 'Operations';
                    return '<div style="position:relative;margin-bottom:20px;">'
                        + '<div style="position:absolute;left:-27px;top:4px;width:11px;height:11px;border-radius:50%;background:'+dot+';border:2px solid #fff;box-shadow:0 0 0 2px '+dot+';flex-shrink:0;"></div>'
                        + '<div style="font-size:11px;color:#9ca3af;margin-bottom:3px;">'+dateStr+', '+timeStr+'</div>'
                        + '<div style="margin-bottom:4px;"><span style="font-size:12.5px;font-weight:700;color:#111827;">'+user+'</span><span style="font-size:12px;color:#6b7280;"> &ndash; '+dept+'</span></div>'
                        + '<div style="font-size:12px;color:#374151;line-height:1.45;margin-bottom:4px;">'+desc+'</div>'
                        + '<span style="display:inline-block;background:'+badge.bg+';color:'+badge.c+';font-size:10.5px;font-weight:600;padding:2px 8px;border-radius:20px;">'+l.action+'</span>'
                        + (l.amount > 0 ? '<span style="font-size:11px;color:#6b7280;margin-left:6px;">\u20b9'+Number(l.amount).toLocaleString('en-IN')+'</span>' : '')
                        + '</div>';
                }).join('')
                + '</div>';
        }
        function mcClearAuditLogs() {
            if (!confirm('Clear all audit logs? This cannot be undone.')) return;
            localStorage.removeItem('mets_audit_logs');
            mcRefreshLiveAudit();
        }
        // METS Reversal logic
        var _revBalances = {
            unallocated: { label:'Unallocated', total:0, hasChannels:false },
            allocated:   { label:'Allocated',   total:0, hasChannels:true,  channels:{ email:0, sms:0, whatsapp:0, niaa:0, guide:0, voice:0, coach:0 } },
            complementary:{ label:'Complementary',total:0, hasChannels:true, channels:{ email:0, sms:0, whatsapp:0, niaa:0, guide:0, voice:0, coach:0 } },
            testing:     { label:'Testing',     total:0,  hasChannels:true,  channels:{ email:0, sms:0, whatsapp:0, niaa:0, guide:0, voice:0, coach:0 } },
            committed:   { label:'Committed',   total:0, hasChannels:true,  channels:{ email:0, sms:0, whatsapp:0, niaa:0, guide:0, voice:0, coach:0 } }
        };
        var _revChLabels = { email:'Email', sms:'SMS', whatsapp:'WhatsApp', niaa:'Niaa', guide:'Mio AI Guide', voice:'Mio AI Voice', coach:'Mio AI Coach' };
        var _revSelPool = null, _revSelChannel = null;
        function mcFmt(n){ return n.toLocaleString('en-IN'); }
        function mcInitRevPools() {
            Object.keys(_revBalances).forEach(function(p) {
                var card = document.getElementById('revpool-' + p);
                if (!card) return;
                var bal = _revBalances[p].total;
                // Update displayed balance
                var divs = card.querySelectorAll('div');
                var lastDiv = divs[divs.length - 1];
                if (lastDiv) lastDiv.textContent = mcFmt(bal);
                // Disable card if balance is 0
                if (bal === 0) {
                    card.style.opacity = '0.45';
                    card.style.cursor = 'not-allowed';
                    card.style.pointerEvents = 'none';
                    card.style.background = '#f9fafb';
                } else {
                    card.style.opacity = '1';
                    card.style.cursor = 'pointer';
                    card.style.pointerEvents = '';
                    card.style.background = '#fff';
                }
            });
        }
        document.addEventListener('DOMContentLoaded', function(){
            mcInitRevPools(); metsLoadBalances(); metsLoadPricing(); mcInitQuickReversal();
            // Keep the dashboard balance in sync with recharges/topups made elsewhere
            // (another session, or directly against the backend) without a manual refresh.
            setInterval(metsLoadBalances, 10000);
            if (sessionStorage.getItem('reopenMets') === '1') {
                sessionStorage.removeItem('reopenMets');
                var sv = document.getElementById('settings-view');
                var sb = document.getElementById('sidebar');
                if (sv) {
                    sv.classList.add('open');
                    if (sb && sb.classList.contains('collapsed')) sv.classList.add('sidebar-collapsed');
                    else sv.classList.remove('sidebar-collapsed');
                }
                if (typeof openSection === 'function') openSection('sec-mets', 'acc-accsettings');
                document.documentElement.classList.remove('restoring-mets');
            }
        });

        function mcSelectRevPool(pool) {
            if (_revBalances[pool].total === 0) return;
            _revSelPool = pool; _revSelChannel = null;
            Object.keys(_revBalances).forEach(function(p){
                var c = document.getElementById('revpool-'+p); if(!c) return;
                var sel = p===pool;
                c.style.border = sel?'2px solid #2563eb':'1.5px solid #e5e7eb';
                c.style.background = sel?'#eff6ff':'#fff';
                var t = c.querySelector('.revpool-title'); if(t) t.style.color = sel?'#1e40af':'#374151';
            });
            var step2 = document.getElementById('rev-step2');
            var step3 = document.getElementById('rev-step3');
            if(_revBalances[pool].hasChannels) {
                var ch = _revBalances[pool].channels;
                var html = Object.keys(ch).map(function(k){
                    var disabled = ch[k] === 0;
                    return '<div id="revchan-'+k+'" '+(disabled?'':'onclick="mcSelectRevChannel(\''+k+'\')"')+' style="border:1.5px solid #e5e7eb;border-radius:10px;padding:14px 16px;'+(disabled?'opacity:0.45;cursor:not-allowed;pointer-events:none;background:#f9fafb;':'cursor:pointer;background:#fff;')+'transition:all 0.15s;">'
                        +'<div style="font-size:12.5px;font-weight:600;color:#374151;margin-bottom:6px;">'+_revChLabels[k]+'</div>'
                        +'<div style="font-size:11px;color:#9ca3af;margin-bottom:2px;">Available</div>'
                        +'<div style="font-size:16px;font-weight:700;color:#111827;">'+mcFmt(ch[k])+'</div>'
                        +'</div>';
                }).join('');
                document.getElementById('rev-channel-grid').innerHTML = html;
                step2.style.display = 'block';
                step3.style.display = 'none';
            } else {
                step2.style.display = 'none';
                mcShowRevStep3(_revBalances[pool].label, null, _revBalances[pool].total);
            }
        }
        function mcSelectRevChannel(ch) {
            var pool = _revBalances[_revSelPool];
            if (pool.channels[ch] === 0) return;
            _revSelChannel = ch;
            Object.keys(pool.channels).forEach(function(k){
                var c = document.getElementById('revchan-'+k); if(!c) return;
                var sel = k===ch;
                c.style.border = sel?'2px solid #2563eb':'1.5px solid #e5e7eb';
                c.style.background = sel?'#eff6ff':'#fff';
                var t = c.querySelector('div'); if(t) t.style.color = sel?'#1e40af':'#374151';
            });
            // WhatsApp under Committed pool → show region + category step
            if(ch === 'whatsapp' && _revSelPool === 'committed') {
                _revWaSelRegion = null; _revWaSelCat = null;
                var waStep = document.getElementById('rev-step-wa');
                waStep.style.display = 'block';
                document.getElementById('rev-step3').style.display = 'none';
                document.getElementById('rev-wa-search').value = '';
                document.getElementById('rev-wa-cats').style.display = 'none';
                mcLoadRevWaBals(_revSelPool, function(){ mcBuildRevWaList(''); });
            } else {
                document.getElementById('rev-step-wa').style.display = 'none';
                mcShowRevStep3(pool.label, _revChLabels[ch], pool.channels[ch], 3);
            }
        }
        function mcShowRevStep3(poolLabel, chLabel, balance, stepNum) {
            var step3 = document.getElementById('rev-step3');
            document.getElementById('rev-step3-form').style.display = 'block';
            document.getElementById('rev-success').style.display = 'none';
            document.getElementById('rev-pool-crumb').textContent = poolLabel + (chLabel ? ' › '+chLabel : '');
            document.getElementById('rev-avail').textContent = mcFmt(balance);
            document.getElementById('rev-avail-max').value = balance;
            document.getElementById('rev-amount-input').value = '';
            document.getElementById('rev-amount-input').max = balance;
            document.getElementById('rev-reason-input').value = '';
            document.getElementById('rev-amount-err').style.display = 'none';
            var sn = stepNum !== undefined ? stepNum : (chLabel ? 3 : 2);
            document.getElementById('rev-step3-num').textContent = sn;
            step3.style.display = 'block';
        }
        // WhatsApp region + category state (only for Committed pool)
        var _revWaSelRegion = null, _revWaSelCat = null;
        var _revWaCats = ['service','marketing','utility','authentication'];
        var _revWaCatLabels = {service:'Service',marketing:'Marketing',utility:'Utility',authentication:'Authentication'};
        var _revWaCatColors = {service:'#16a34a',marketing:'#7c3aed',utility:'#d97706',authentication:'#2563eb'};
        var _revWaCatBgs = {service:'#f0fdf4',marketing:'#f5f3ff',utility:'#fffbeb',authentication:'#eff6ff'};
        var _revWaCatIcons = {
            service:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
            marketing:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
            utility:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
            authentication:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
        };
        var _revWaRegionBals = {}; // {region: {category: balance}}
        var _revWaFallback = false; // true when no granular region data → fall back to full region list
        function mcRevWaBal(region, cat) {
            if (_revWaFallback) return 0; // no per-region data; caller uses total WA balance instead
            return (_revWaRegionBals[region] && _revWaRegionBals[region][cat]) || 0;
        }
        function _revWaTotalBal() {
            return (_revBalances[_revSelPool] && _revBalances[_revSelPool].channels && _revBalances[_revSelPool].channels.whatsapp) || 0;
        }
        function mcLoadRevWaBals(pool, cb) {
            fetch(API_BASE + '/api/mets/wa-region-balances?pool=' + encodeURIComponent(pool))
                .then(function(r){ return r.json(); })
                .then(function(rows) {
                    _revWaRegionBals = {};
                    rows.forEach(function(row) {
                        if (!_revWaRegionBals[row.region]) _revWaRegionBals[row.region] = {};
                        _revWaRegionBals[row.region][row.category] = row.balance;
                    });
                    if (cb) cb();
                })
                .catch(function(){ _revWaRegionBals = {}; if (cb) cb(); });
        }
        function mcBuildRevWaList(filter) {
            var q = (filter || '').toLowerCase();
            var list = document.getElementById('rev-wa-list');
            if (!list) return;
            // Regions that have at least one category with balance > 0
            var availableRegions = Object.keys(_revWaRegionBals).filter(function(r) {
                return Object.values(_revWaRegionBals[r]).some(function(b){ return b > 0; });
            });
            // Fallback: no granular data but WA balance exists → show only pricing-configured regions
            _revWaFallback = false;
            if (availableRegions.length === 0 && _revWaTotalBal() > 0) {
                availableRegions = _mcWaPricingRegions.slice();
                _revWaFallback = true;
            }
            var regions = availableRegions.filter(function(r){ return !q || r.toLowerCase().indexOf(q) !== -1; });
            if (regions.length === 0) {
                list.innerHTML = '<div style="padding:16px;text-align:center;color:#9ca3af;font-size:12.5px;">No regions found</div>';
                return;
            }
            list.innerHTML = regions.map(function(r) {
                var parts = r.split('-');
                var code, name;
                if (parts.length > 1 && /^\+\d+$/.test(parts[0])) { code = parts[0]; name = parts.slice(1).join('-'); }
                else { code = ''; name = r; } // plain name stored without dial code
                var sel = r === _revWaSelRegion;
                var regionBal = _revWaFallback ? _revWaTotalBal()
                    : Object.values(_revWaRegionBals[r] || {}).reduce(function(s,b){ return s+b; }, 0);
                return '<div onclick="mcSelectRevWaRegion(\''+r.replace(/\\/g,'\\\\').replace(/'/g,"\\'")+'\',this)" '
                    +'style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;cursor:pointer;border-bottom:1px solid #f3f4f6;background:'+(sel?'#eff6ff':'#fff')+';transition:background 0.1s;" '
                    +'onmouseover="if(!this.classList.contains(\'wa-sel\'))this.style.background=\'#f8faff\'" '
                    +'onmouseout="if(!this.classList.contains(\'wa-sel\'))this.style.background=\'#fff\'" '
                    +(sel?'class="wa-sel"':'')+'>'
                    +'<div style="display:flex;align-items:center;gap:9px;">'
                    +(sel?'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>':'<div style="width:12px;"></div>')
                    +'<span style="font-size:13px;color:#111827;font-weight:'+(sel?'600':'400')+';"> '+(code ? code+'-'+name : name)+'</span>'
                    +'</div>'
                    +'<span style="font-size:12px;font-weight:600;color:#2563eb;">'+mcFmt(regionBal)+'</span>'
                    +'</div>';
            }).join('');
        }
        function mcFilterRevWaRegions(q) { mcBuildRevWaList(q); }
        function mcSelectRevWaRegion(region) {
            _revWaSelRegion = region; _revWaSelCat = null;
            mcBuildRevWaList(document.getElementById('rev-wa-search').value);
            var _rp = region.split('-'); var regionName = (_rp.length > 1 && /^\+\d+$/.test(_rp[0])) ? _rp.slice(1).join('-') : region;
            document.getElementById('rev-wa-region-name').textContent = regionName;
            var catsWrap = document.getElementById('rev-wa-cats');
            var ph = document.getElementById('rev-wa-placeholder'); if(ph) ph.style.display = 'none';
            catsWrap.style.display = 'block';
            document.getElementById('rev-step3').style.display = 'none';
            // Fallback: no per-category DB data — show all 4 cats without balance (balance shown in step 3)
            // Real data: only show categories with balance > 0
            var catsWithBal = _revWaFallback
                ? _revWaCats
                : _revWaCats.filter(function(cat){ return mcRevWaBal(region, cat) > 0; });
            var html = catsWithBal.length
                ? catsWithBal.map(function(cat) {
                    var bal = _revWaFallback ? _revWaTotalBal() : mcRevWaBal(region, cat);
                    var col = _revWaCatColors[cat]; var bg = _revWaCatBgs[cat];
                    return '<div id="rev-wacat-'+cat+'" onclick="mcSelectRevWaCategory(\''+cat+'\')" '
                        +'style="border:1.5px solid #e5e7eb;border-radius:10px;padding:16px 14px;cursor:pointer;background:#fff;transition:all 0.15s;" '
                        +'onmouseover="if(!this.classList.contains(\'wacat-sel\'))this.style.background=\'#fafbfc\'" '
                        +'onmouseout="if(!this.classList.contains(\'wacat-sel\'))this.style.background=\'#fff\'">'
                        +'<div style="width:32px;height:32px;border-radius:8px;background:'+bg+';display:flex;align-items:center;justify-content:center;margin-bottom:10px;color:'+col+';">'
                        +_revWaCatIcons[cat]+'</div>'
                        +'<div style="font-size:12.5px;font-weight:600;color:#374151;margin-bottom:6px;">'+_revWaCatLabels[cat]+'</div>'
                        +(bal !== null
                            ? '<div style="font-size:11px;color:#9ca3af;margin-bottom:3px;">Available</div><div style="font-size:15px;font-weight:700;color:#111827;">'+mcFmt(bal)+'</div>'
                            : '')
                        +'</div>';
                  }).join('')
                : '<div style="padding:20px;text-align:center;font-size:13px;color:#9ca3af;">No available balance for this region</div>';
            document.getElementById('rev-wa-catgrid').innerHTML = html;
        }
        function mcSelectRevWaCategory(cat) {
            _revWaSelCat = cat;
            _revWaCats.forEach(function(c) {
                var card = document.getElementById('rev-wacat-'+c); if(!card) return;
                var sel = c === cat;
                var col = _revWaCatColors[c]; var bg = _revWaCatBgs[c];
                card.style.border = sel ? '2px solid '+col : '1.5px solid #e5e7eb';
                card.style.background = sel ? bg : '#fff';
                if(sel) card.classList.add('wacat-sel'); else card.classList.remove('wacat-sel');
                var title = card.querySelectorAll('div')[3]; if(title) title.style.color = sel ? col : '#374151';
            });
            var bal = _revWaFallback ? _revWaTotalBal() : mcRevWaBal(_revWaSelRegion, cat);
            var _rp2 = _revWaSelRegion.split('-'); var regionName = (_rp2.length > 1 && /^\+\d+$/.test(_rp2[0])) ? _rp2.slice(1).join('-') : _revWaSelRegion;
            var pool = _revBalances[_revSelPool];
            mcShowRevStep3(pool.label + ' \u203a WhatsApp \u203a ' + regionName, _revWaCatLabels[cat], bal, 4);
        }
        function mcValidateRevAmount(input) {
            var max = parseFloat(document.getElementById('rev-avail-max').value)||0;
            var err = document.getElementById('rev-amount-err');
            if(input.value && parseFloat(input.value)>max){
                err.textContent = 'Cannot exceed available balance of '+mcFmt(max)+' METS';
                err.style.display = 'block';
                input.style.borderColor = '#ef4444';
            } else {
                err.style.display = 'none';
                input.style.borderColor = parseFloat(input.value)>0?'#2563eb':'#e5e7eb';
            }
        }
        async function mcSubmitReversal() {
            var amount = parseFloat(document.getElementById('rev-amount-input').value);
            var reason = document.getElementById('rev-reason-input').value.trim();
            var max = parseFloat(document.getElementById('rev-avail-max').value)||0;
            var err = document.getElementById('rev-amount-err');
            if(!amount||amount<=0){ err.textContent='Please enter a valid amount.'; err.style.display='block'; return; }
            if(amount>max){ err.textContent='Cannot exceed '+mcFmt(max)+' METS'; err.style.display='block'; return; }
            if(!reason){ document.getElementById('rev-reason-err').style.display='block'; return; }
            try {
                var resp = await fetch(API_BASE + '/api/mets/reversal', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pool: _revSelPool, channel: _revSelChannel, amount: amount, reason: reason, notes: (document.getElementById('rev-notes-input') || {}).value || '', region: _revWaSelRegion, category: _revWaSelCat })
                });
                if (!resp.ok) throw new Error('Server error');
                var crumb = document.getElementById('rev-pool-crumb').textContent;
                document.getElementById('rev-success-amt').textContent = mcFmt(amount)+' METS';
                document.getElementById('rev-success-pool').textContent = crumb;
                document.getElementById('rev-step3-form').style.display = 'none';
                document.getElementById('rev-success').style.display = 'block';
                metsLoadBalances();
            } catch(e) {
                err.textContent = 'Failed to submit reversal. Please try again.';
                err.style.display = 'block';
            }
        }
        function mcResetReversal() {
            _revSelPool = null; _revSelChannel = null;
            _revWaSelRegion = null; _revWaSelCat = null;
            Object.keys(_revBalances).forEach(function(p){
                var c = document.getElementById('revpool-'+p); if(!c) return;
                c.style.border='1.5px solid #e5e7eb'; c.style.background='#fff';
                var t = c.querySelector('.revpool-title'); if(t) t.style.color='#374151';
            });
            document.getElementById('rev-step2').style.display = 'none';
            document.getElementById('rev-step-wa').style.display = 'none';
            document.getElementById('rev-step3').style.display = 'none';
        }
        // ── Quick Reverse METS ────────────────────────────────────────────────────
        var _qrevRows = []; // { pool, channel, poolLabel, chLabel, balance }
        var _qrevFilterPool    = null; // null = All
        var _qrevFilterChannel = null; // null = All
        var _qrevDropdownOpen  = null; // 'pool' | 'channel' | null

        var _qrevPoolTag = {
            unallocated:   { color:'#5a8c72', bg:'#eaf3ed' },
            allocated:     { color:'#5b7fa6', bg:'#e8eef6' },
            committed:     { color:'#5b7fa6', bg:'#e8eef6' },
            complementary: { color:'#8a72aa', bg:'#ede8f5' },
            testing:       { color:'#b8915a', bg:'#f2e8d8' }
        };

        function mcInitQuickReversal() {
            var overlay    = document.getElementById('quick-rev-overlay');
            var closeBtn   = document.getElementById('qrev-close-btn');
            var cancelBtn  = document.getElementById('qrev-cancel-btn');
            var nextBtn    = document.getElementById('qrev-next-btn');
            var backBtn    = document.getElementById('qrev-back-btn');
            var submitBtn  = document.getElementById('qrev-submit-btn');

            var reasonEl   = document.getElementById('qrev-reason');
            var poolWrap   = document.getElementById('qrev-pool-wrap');
            var featWrap   = document.getElementById('qrev-feature-wrap');
            if (overlay)   overlay.addEventListener('click', mcCloseQuickReversal);
            if (closeBtn)  closeBtn.addEventListener('click', mcCloseQuickReversal);
            if (cancelBtn) cancelBtn.addEventListener('click', mcCloseQuickReversal);
            if (nextBtn)   nextBtn.addEventListener('click', mcQrevNextPage);
            if (backBtn)   backBtn.addEventListener('click', mcQrevBackPage);
            if (submitBtn) submitBtn.addEventListener('click', mcSubmitQuickReversal);
            if (reasonEl)  reasonEl.addEventListener('change', mcQrevClearReasonErr);
            if (poolWrap)  poolWrap.addEventListener('click', function(e) { e.stopPropagation(); mcQrevOpenDropdown('pool', poolWrap); });
            if (featWrap)  featWrap.addEventListener('click', function(e) { e.stopPropagation(); mcQrevOpenDropdown('channel', featWrap); });
            // Dropdown item delegation
            var panel = document.getElementById('qrev-dropdown-panel');
            if (panel) panel.addEventListener('click', function(e) {
                var item = e.target.closest('.qrev-dropdown-item');
                if (item) mcQrevSelectFilter(item.dataset.filterType, item.dataset.filterValue || null);
            });
            // Close on outside click
            document.addEventListener('click', function(e) {
                if (_qrevDropdownOpen && !e.target.closest('#qrev-dropdown-panel') &&
                    !e.target.closest('#qrev-pool-wrap') && !e.target.closest('#qrev-feature-wrap')) {
                    mcQrevCloseDropdown();
                }
            });
        }

        function mcQrevNextPage() {
            // Validate at least one amount entered
            var hasAmount = _qrevRows.some(function(row, i) {
                var amt = document.getElementById('qrev-amt-' + i);
                return amt && parseFloat(amt.value) > 0;
            });
            if (!hasAmount) {
                var el = document.getElementById('qrev-summary');
                if (el) { el.textContent = 'Enter at least one amount to continue.'; el.style.color = '#ef4444'; }
                return;
            }
            // Build page 2 summary
            mcQrevBuildP2Summary();
            // Reset reason/notes
            var reasonEl = document.getElementById('qrev-reason');
            var notesEl  = document.getElementById('qrev-notes');
            var reasonErr = document.getElementById('qrev-reason-err');
            if (reasonEl)  reasonEl.value = '';
            if (notesEl)   notesEl.value = '';
            if (reasonErr) reasonErr.style.display = 'none';
            // Switch pages
            var p1 = document.getElementById('qrev-page1');
            var p2 = document.getElementById('qrev-page2');
            if (p1) p1.style.display = 'none';
            if (p2) { p2.style.display = 'flex'; }
        }

        function mcQrevBackPage() {
            var p1 = document.getElementById('qrev-page1');
            var p2 = document.getElementById('qrev-page2');
            if (p2) p2.style.display = 'none';
            if (p1) p1.style.display = 'flex';
        }

        function mcQrevBuildP2Summary() {
            var el = document.getElementById('qrev-p2-summary');
            if (!el) return;
            var creditPools = { testing: true, complementary: true };
            var entries = [];
            var grandTotal = 0;
            var mixedUnits = false;
            var firstUnit = null;
            _qrevRows.forEach(function(row, i) {
                var amt = document.getElementById('qrev-amt-' + i);
                var v = parseFloat(amt ? amt.value : '') || 0;
                if (v <= 0) return;
                var unit = creditPools[row.pool] ? 'Credits' : 'METS';
                if (firstUnit === null) firstUnit = unit;
                else if (firstUnit !== unit) mixedUnits = true;
                grandTotal += v;
                entries.push({ label: row.poolLabel + (row.chLabel ? ' \u203a ' + row.chLabel : ''), amount: v, unit: unit });
            });

            if (!entries.length) {
                el.innerHTML = '<span style="color:#9ca3af;font-size:12.5px;">No amounts entered.</span>';
                return;
            }

            var rows = entries.map(function(e) {
                return '<div style="display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid #f0f2f5;">'
                    + '<div style="display:flex;align-items:center;gap:7px;">'
                    + '<div style="width:6px;height:6px;border-radius:50%;background:#94a3b8;flex-shrink:0;"></div>'
                    + '<span style="font-size:12.5px;color:#4b5563;">' + e.label + '</span>'
                    + '</div>'
                    + '<span style="font-size:13px;font-weight:600;color:#111827;letter-spacing:-0.01em;">'
                    + mcFmt(e.amount) + '<span style="font-size:11px;font-weight:500;color:#6b7280;margin-left:3px;">' + e.unit + '</span>'
                    + '</span>'
                    + '</div>';
            }).join('');

            var totalUnit = mixedUnits ? 'METS/Credits' : (firstUnit || 'METS');
            var totalRow = '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0 2px;">'
                + '<span style="font-size:12px;font-weight:600;color:#374151;text-transform:uppercase;letter-spacing:0.04em;">Total Reversal</span>'
                + '<span style="font-size:14px;font-weight:700;color:#111827;letter-spacing:-0.02em;">'
                + mcFmt(grandTotal) + '<span style="font-size:11px;font-weight:500;color:#6b7280;margin-left:3px;">' + totalUnit + '</span>'
                + '</span>'
                + '</div>';

            el.innerHTML = '<div style="font-size:10.5px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">Reversal Summary</div>'
                + rows + totalRow;
        }

        function mcQrevClearReasonErr() {
            var err = document.getElementById('qrev-reason-err');
            if (err) err.style.display = 'none';
        }

        function mcQrevProcessData(balData, waRowsArr, smsRowsArr) {
            _qrevRows = [];
            var waRegionMap = {};
            var smsTypeMap  = {};

            // Update _revBalances with latest data
            if (balData) {
                Object.keys(balData).forEach(function(pool) {
                    if (!_revBalances[pool]) return;
                    _revBalances[pool].total = balData[pool].total || 0;
                    if (_revBalances[pool].channels && balData[pool].channels) {
                        Object.keys(_revBalances[pool].channels).forEach(function(ch) {
                            _revBalances[pool].channels[ch] = balData[pool].channels[ch] || 0;
                        });
                    }
                });
            }
            if (waRowsArr) waRowsArr.forEach(function(r) {
                if (!waRegionMap[r.pool]) waRegionMap[r.pool] = [];
                waRegionMap[r.pool].push(r);
            });
            if (smsRowsArr) smsRowsArr.forEach(function(r) {
                if (!smsTypeMap[r.pool]) smsTypeMap[r.pool] = [];
                smsTypeMap[r.pool].push(r);
            });

            var poolOrder = ['unallocated', 'allocated', 'committed', 'complementary', 'testing'];
            var _revWaCatLabels = { service:'Service', marketing:'Marketing', utility:'Utility', authentication:'Authentication' };

            poolOrder.forEach(function(pool) {
                var b = _revBalances[pool];
                if (!b) return;

                if (b.hasChannels && b.channels) {
                    var addedCount = 0;
                    Object.keys(b.channels).forEach(function(ch) {
                        var bal = b.channels[ch] || 0;
                        if (bal <= 0) return;
                        if (ch === 'whatsapp' && waRegionMap[pool] && waRegionMap[pool].length) {
                            waRegionMap[pool].forEach(function(wr) {
                                if (wr.balance <= 0) return;
                                var regionDisplay = wr.region.includes('-') ? wr.region.split('-').slice(1).join('-') : wr.region;
                                var catLabel = _revWaCatLabels[wr.category] || wr.category;
                                _qrevRows.push({ pool: pool, channel: 'whatsapp', poolLabel: b.label, chLabel: 'WhatsApp \u203a ' + regionDisplay + ' \u203a ' + catLabel, balance: wr.balance, region: wr.region, category: wr.category });
                                addedCount++;
                            });
                        } else if (ch === 'sms' && smsTypeMap[pool] && smsTypeMap[pool].length) {
                            smsTypeMap[pool].forEach(function(sr) {
                                if (sr.balance <= 0) return;
                                var typeLabel = sr.sms_type.charAt(0).toUpperCase() + sr.sms_type.slice(1);
                                _qrevRows.push({ pool: pool, channel: 'sms', poolLabel: b.label, chLabel: 'SMS \u203a ' + typeLabel, balance: sr.balance, smsType: sr.sms_type });
                                addedCount++;
                            });
                        } else {
                            _qrevRows.push({ pool: pool, channel: ch, poolLabel: b.label, chLabel: _revChLabels[ch] || ch, balance: bal });
                            addedCount++;
                        }
                    });
                    if (addedCount === 0 && b.total > 0) {
                        _qrevRows.push({ pool: pool, channel: null, poolLabel: b.label, chLabel: null, balance: b.total });
                    }
                } else if (!b.hasChannels && b.total > 0) {
                    _qrevRows.push({ pool: pool, channel: null, poolLabel: b.label, chLabel: null, balance: b.total });
                }
            });
        }

        function mcQrevFillMax(i) {
            var amt = document.getElementById('qrev-amt-' + i);
            if (amt && _qrevRows[i]) { amt.value = _qrevRows[i].balance; }
            mcQrevUpdateSummary();
        }

        function mcQrevMakeAmtBlur(i) {
            return function(e) {
                var input = e.target;
                var max = _qrevRows[i] ? _qrevRows[i].balance : 0;
                var v = parseFloat(input.value);
                if (!isNaN(v) && v > max) input.value = max;
            };
        }

        function mcQrevMakeMaxClick(i) {
            return function(e) { e.stopPropagation(); mcQrevFillMax(i); };
        }

        // Feature dropdown labels (channel key → display name)
        var _qrevChipLabels = { email:'Email', sms:'SMS', whatsapp:'WhatsApp', niaa:'Niaa', guide:'Mio AI Guide', voice:'Mio AI Voice', coach:'Mio AI Coach' };

        function mcQrevBuildFilters() {
            // Update trigger labels only — dropdown options built on open
            mcQrevUpdateTriggerLabel('pool');
            mcQrevUpdateTriggerLabel('channel');
        }

        function mcQrevUpdateTriggerLabel(type) {
            var labelEl = document.getElementById(type === 'pool' ? 'qrev-pool-label' : 'qrev-feature-label');
            if (!labelEl) return;
            var val = type === 'pool' ? _qrevFilterPool : _qrevFilterChannel;
            if (!val) {
                labelEl.textContent = 'Select Here';
                labelEl.className   = 'qrev-filter-placeholder';
            } else if (type === 'pool') {
                labelEl.textContent = (_revBalances[val] && _revBalances[val].label) || val;
                labelEl.className   = 'qrev-filter-selected';
            } else {
                labelEl.textContent = _qrevChipLabels[val] || val;
                labelEl.className   = 'qrev-filter-selected';
            }
        }

        function mcQrevOpenDropdown(type, wrapEl) {
            var panel = document.getElementById('qrev-dropdown-panel');
            if (!panel) return;
            // Toggle close if already open for same type
            if (_qrevDropdownOpen === type) { mcQrevCloseDropdown(); return; }
            mcQrevCloseDropdown();
            _qrevDropdownOpen = type;
            wrapEl.classList.add('filter-open');

            // Collect options
            var options = [];
            var seen    = {};
            _qrevRows.forEach(function(row) {
                if (type === 'pool') {
                    if (!seen[row.pool]) {
                        seen[row.pool] = true;
                        options.push({ value: row.pool, label: (_revBalances[row.pool] && _revBalances[row.pool].label) || row.pool });
                    }
                } else {
                    if (row.channel && !seen[row.channel]) {
                        seen[row.channel] = true;
                        options.push({ value: row.channel, label: _qrevChipLabels[row.channel] || row.channel });
                    }
                }
            });

            // Build panel HTML
            var current = type === 'pool' ? _qrevFilterPool : _qrevFilterChannel;
            var html = '<div class="qrev-dropdown-item qrev-dropdown-item-all' + (!current ? ' active' : '') + '" data-filter-type="' + type + '" data-filter-value="">All</div>';
            options.forEach(function(opt) {
                var isActive = current === opt.value;
                html += '<div class="qrev-dropdown-item' + (isActive ? ' active' : '') + '" data-filter-type="' + type + '" data-filter-value="' + opt.value + '">' + opt.label + '</div>';
            });
            panel.innerHTML = html;

            // Position below the trigger
            var rect = wrapEl.getBoundingClientRect();
            panel.style.left   = rect.left + 'px';
            panel.style.top    = (rect.bottom + 4) + 'px';
            panel.style.width  = rect.width + 'px';
            panel.style.display = 'block';
        }

        function mcQrevCloseDropdown() {
            var panel = document.getElementById('qrev-dropdown-panel');
            if (panel) panel.style.display = 'none';
            document.querySelectorAll('#qrev-pool-wrap,#qrev-feature-wrap').forEach(function(el) { el.classList.remove('filter-open'); });
            // Reset chevron rotation
            document.querySelectorAll('#qrev-pool-trigger svg, #qrev-feature-trigger svg').forEach(function(svg) { svg.style.transform = ''; });
            _qrevDropdownOpen = null;
        }

        function mcQrevSelectFilter(type, value) {
            if (type === 'pool')    _qrevFilterPool    = value || null;
            if (type === 'channel') _qrevFilterChannel = value || null;
            mcQrevCloseDropdown();
            mcQrevUpdateTriggerLabel(type);
            mcQrevRenderRows();
        }

        function mcQrevRenderRows() {
            var listEl = document.getElementById('qrev-list');
            if (!listEl) return;
            if (!_qrevRows.length) {
                listEl.innerHTML = '<div style="padding:30px 0;text-align:center;color:#9ca3af;font-size:13px;">No channels with available balance.</div>';
                return;
            }
            listEl.innerHTML = '';

            // Apply active filters
            var visibleRows = _qrevRows.filter(function(row) {
                var poolMatch = !_qrevFilterPool    || row.pool === _qrevFilterPool;
                var chanMatch = !_qrevFilterChannel || row.channel === _qrevFilterChannel;
                return poolMatch && chanMatch;
            });

            if (!visibleRows.length) {
                listEl.innerHTML = '<div style="padding:30px 0;text-align:center;color:#9ca3af;font-size:13px;">No channels match the selected filters.</div>';
                return;
            }

            // Group rows by pool, maintaining order
            var groups = []; // [{ pool, poolLabel, tag, rows:[{row,i}] }]
            var groupMap = {};
            visibleRows.forEach(function(row) {
                var i = _qrevRows.indexOf(row);
                if (!groupMap[row.pool]) {
                    var tag = _qrevPoolTag[row.pool] || { color:'#6b7280', bg:'#f3f4f6' };
                    var g = { pool: row.pool, poolLabel: row.poolLabel, tag: tag, rows: [] };
                    groups.push(g);
                    groupMap[row.pool] = g;
                }
                groupMap[row.pool].rows.push({ row: row, i: i });
            });

            groups.forEach(function(group) {
                // Section header
                var header = document.createElement('div');
                header.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:6px;margin-top:14px;';
                var dot = document.createElement('span');
                dot.style.cssText = 'display:inline-block;width:8px;height:8px;border-radius:50%;background:' + group.tag.color + ';flex-shrink:0;';
                var label = document.createElement('span');
                label.style.cssText = 'font-size:11.5px;font-weight:700;color:' + group.tag.color + ';text-transform:uppercase;letter-spacing:0.05em;';
                label.textContent = group.poolLabel;
                var line = document.createElement('div');
                line.style.cssText = 'flex:1;height:1px;background:#e8eaee;';
                header.appendChild(dot); header.appendChild(label); header.appendChild(line);
                listEl.appendChild(header);

                // Rows within group
                group.rows.forEach(function(item) {
                    var row = item.row; var i = item.i;

                    var row_el = document.createElement('div');
                    row_el.style.cssText = 'display:flex;align-items:center;gap:12px;padding:10px 14px;background:#fff;border:1px solid #e8eaee;border-radius:8px;margin-bottom:6px;';

                    // Channel name
                    var chName = document.createElement('div');
                    chName.style.cssText = 'flex:1;font-size:13px;font-weight:600;color:#111827;';
                    chName.textContent = row.chLabel || row.poolLabel;

                    // Available balance
                    var avail = document.createElement('div');
                    avail.style.cssText = 'flex-shrink:0;font-size:12px;color:#9ca3af;white-space:nowrap;';
                    avail.innerHTML = '<span style="font-weight:700;color:#374151;">' + mcFmt(row.balance) + '</span> avail.';

                    // Amount input
                    var amt = document.createElement('input');
                    amt.type = 'number'; amt.id = 'qrev-amt-' + i;
                    amt.className = 'qrev-amt-input';
                    var unitLabel = (row.pool === 'testing' || row.pool === 'complementary') ? 'Credits' : 'METS';
                    amt.placeholder = unitLabel; amt.min = '0.01'; amt.max = String(row.balance); amt.step = 'any';
                    amt.addEventListener('input', mcQrevUpdateSummary);
                    amt.addEventListener('blur', mcQrevMakeAmtBlur(i));

                    row_el.appendChild(chName); row_el.appendChild(avail); row_el.appendChild(amt);
                    listEl.appendChild(row_el);
                });
            });
        }

        function mcQrevUpdateSummary() {
            var totalMets = 0; var totalCredits = 0; var count = 0;
            var creditPools = { testing: true, complementary: true };
            _qrevRows.forEach(function(row, i) {
                var amt = document.getElementById('qrev-amt-' + i);
                if (amt) {
                    var v = parseFloat(amt.value) || 0;
                    if (v > 0) {
                        count++;
                        if (creditPools[row.pool]) totalCredits += v;
                        else totalMets += v;
                    }
                }
            });

            var el = document.getElementById('qrev-summary');
            if (!el) return;
            if (!count) { el.textContent = 'Specify amounts to deduct'; el.style.color = '#6b7280'; return; }
            el.style.color = '#6b7280';
            var parts = [];
            if (totalMets > 0)    parts.push(mcFmt(totalMets) + ' METS');
            if (totalCredits > 0) parts.push(mcFmt(totalCredits) + ' Credits');
            el.textContent = count + ' channel' + (count > 1 ? 's' : '') + ' \u2014 ' + parts.join(' + ');
        }

        function mcOpenQuickReversal() {
            var modal     = document.getElementById('quick-rev-modal');
            var overlay   = document.getElementById('quick-rev-overlay');
            var reasonEl  = document.getElementById('qrev-reason');
            var notesEl   = document.getElementById('qrev-notes');
            var reasonErr = document.getElementById('qrev-reason-err');
            if (!modal) return;
            // Always start on page 1
            var p1 = document.getElementById('qrev-page1');
            var p2 = document.getElementById('qrev-page2');
            if (p1) p1.style.display = 'flex';
            if (p2) p2.style.display = 'none';
            if (reasonEl)  reasonEl.value = '';
            if (notesEl)   notesEl.value = '';
            if (reasonErr) reasonErr.style.display = 'none';
            _qrevFilterPool    = null;
            _qrevFilterChannel = null;
            mcQrevCloseDropdown();
            // Show modal immediately, then load content
            if (overlay) { overlay.style.display = 'block'; overlay.style.animation = 'qrev-fade-in 0.2s ease'; }
            modal.style.display = 'flex';
            modal.style.animation = 'qrev-slide-in 0.25s cubic-bezier(0.32,0.72,0,1)';
            // Load data and render
            fetch(API_BASE + '/api/mets/balances').then(function(r){ return r.json(); }).then(function(balData){
                return Promise.all([
                    Promise.resolve(balData),
                    fetch(API_BASE + '/api/mets/wa-region-balances').then(function(r){ return r.json(); }),
                    fetch(API_BASE + '/api/mets/sms-type-balances').then(function(r){ return r.json(); })
                ]);
            }).then(function(results){
                mcQrevProcessData(results[0], results[1], results[2]);
                mcQrevBuildFilters();
                mcQrevRenderRows();
                mcQrevUpdateSummary();
            }).catch(function(err){
                console.error('qrev load error:', err);
                mcQrevRenderRows();
                mcQrevUpdateSummary();
            });
        }

        function mcCloseQuickReversal() {
            var modal   = document.getElementById('quick-rev-modal');
            var overlay = document.getElementById('quick-rev-overlay');
            if (!modal) return;
            modal.style.animation = 'qrev-slide-out 0.22s cubic-bezier(0.32,0.72,0,1) forwards';
            if (overlay) overlay.style.animation = 'qrev-fade-out 0.22s ease forwards';
            setTimeout(function() {
                modal.style.display = 'none';
                modal.style.animation = '';
                if (overlay) { overlay.style.display = 'none'; overlay.style.animation = ''; }
            }, 220);
        }

        async function mcSubmitQuickReversal() {
            var reasonEl  = document.getElementById('qrev-reason');
            var notesEl   = document.getElementById('qrev-notes');
            var reasonErr = document.getElementById('qrev-reason-err');
            var reason = reasonEl ? reasonEl.value : '';
            if (!reason) { if (reasonErr) reasonErr.style.display = 'block'; return; }
            if (reasonErr) reasonErr.style.display = 'none';
            var notes = notesEl ? notesEl.value.trim() : '';

            var toReverse = [];
            var valid = true;
            _qrevRows.forEach(function(row, i) {
                var amt = document.getElementById('qrev-amt-' + i);
                var v = parseFloat(amt ? amt.value : '');
                if (!amt || !amt.value) return; // skip blank rows
                if (v <= 0 || v > row.balance) {
                    if (amt) amt.style.borderColor = '#ef4444';
                    valid = false;
                    return;
                }
                toReverse.push({ pool: row.pool, channel: row.channel, amount: v, reason: reason, notes: notes, region: row.region || null, category: row.category || null, smsType: row.smsType || null });
            });
            if (!valid) return;
            if (!toReverse.length) {
                var summaryEl = document.getElementById('qrev-summary');
                if (summaryEl) { summaryEl.textContent = 'Specify at least one amount to deduct.'; summaryEl.style.color = '#ef4444'; }
                return;
            }

            var btn = document.getElementById('qrev-submit-btn');
            if (btn) { btn.disabled = true; btn.textContent = 'Reversing\u2026'; }

            try {
                for (var j = 0; j < toReverse.length; j++) {
                    var r = toReverse[j];
                    var resp = await fetch(API_BASE + '/api/mets/reversal', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ pool: r.pool, channel: r.channel, amount: r.amount, reason: r.reason, notes: r.notes, region: r.region, category: r.category, smsType: r.smsType })
                    });
                    if (!resp.ok) throw new Error('Server error');
                }
                mcCloseQuickReversal();
                metsLoadBalances();
            } catch(e) {
                var listEl = document.getElementById('qrev-list');
                if (listEl) {
                    var errDiv = document.createElement('div');
                    errDiv.style.cssText = 'margin-top:8px;padding:8px 12px;background:#fef2f2;border:1px solid #fecaca;border-radius:7px;font-size:12.5px;color:#dc2626;';
                    errDiv.textContent = 'Failed to complete all reversals. Please try again.';
                    listEl.appendChild(errDiv);
                }
            } finally {
                if (btn) { btn.disabled = false; btn.textContent = 'Reverse METS'; }
            }
        }

        function mcEditRow(btn, newVal) {
            var td = btn.closest('td').previousElementSibling;
            var wrap = td.querySelector('.rt-input-wrap');
            var text = td.querySelector('.rt-val-text');
            var actions = btn.closest('.rt-action-wrap');
            if (wrap) { wrap.style.display = 'flex'; if(text) text.style.display='none'; actions.innerHTML = '<button class="rt-save-btn" onclick="mcSaveRow(this)">Save</button><button class="rt-cancel-btn" onclick="mcCancelRow(this)">Cancel</button>'; }
        }
        function mcSaveRow(btn) {
            var tr = btn.closest('tr');
            var input = tr.querySelector('.rt-input');
            var text = tr.querySelector('.rt-val-text');
            var wrap = tr.querySelector('.rt-input-wrap');
            var oldVal = text ? text.textContent : '';
            var newVal = input ? (input.value || oldVal) : oldVal;
            if (input && text) { text.textContent = newVal; text.style.display=''; if(wrap) wrap.style.display='none'; }
            var actions = btn.closest('.rt-action-wrap');
            actions.innerHTML = '<button class="rt-edit-link" onclick="mcEditRow(this)"><svg width="12" height="12" viewBox="0 0 20 20" fill="none"><path d="M14.5 3.5l2 2L6 16H4v-2L14.5 3.5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>Edit</button>';
            // Log pricing changes to audit
            var tbody = tr.closest('tbody');
            if (tbody && tbody.id === 'mc-pricing-tbody' && newVal !== oldVal) {
                var labelEl = tr.querySelector('.rt-tag-chip');
                var field = labelEl ? labelEl.textContent.trim() : 'Unknown field';
                fetch(API_BASE + '/api/mets/pricing-change', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ field: field, oldValue: oldVal, newValue: newVal })
                }).catch(function(){});
            }
        }
        function mcCancelRow(btn) {
            var tr = btn.closest('tr');
            var input = tr.querySelector('.rt-input');
            var text = tr.querySelector('.rt-val-text');
            var wrap = tr.querySelector('.rt-input-wrap');
            if (text) text.style.display=''; if(wrap) wrap.style.display='none';
            var actions = btn.closest('.rt-action-wrap');
            actions.innerHTML = '<button class="rt-edit-link" onclick="mcEditRow(this)"><svg width="12" height="12" viewBox="0 0 20 20" fill="none"><path d="M14.5 3.5l2 2L6 16H4v-2L14.5 3.5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>Edit</button>';
        }
        function mcBuildRow(label, value, type) {
            var inputEl = type === 'select'
                ? '<select class="rt-input" style="height:36px;"><option>INR</option><option>USD</option><option>EUR</option></select>'
                : (type === 'select-toggle'
                    ? '<select class="rt-input" style="height:36px;"><option>Disabled</option><option>Enabled</option></select>'
                    : '<input class="rt-input" type="text" value="' + value + '" placeholder="Enter value">');
            return '<tr><td><span class="rt-tag-chip">' + label + '</span></td>'
                + '<td><div class="rt-val-text">' + value + '</div><div class="rt-input-wrap" style="display:none;">' + inputEl + '</div></td>'
                + '<td><div class="rt-action-wrap"><button class="rt-edit-link" onclick="mcEditRow(this)"><svg width="12" height="12" viewBox="0 0 20 20" fill="none"><path d="M14.5 3.5l2 2L6 16H4v-2L14.5 3.5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>Edit</button></div></td></tr>';
        }
        (function initMetsConfig() {
            var topup = document.getElementById('mc-topup-tbody');
            if (topup) topup.innerHTML = [
                mcBuildRow('Top-Up Amount',   '₹ 50,000',   'text'),
                mcBuildRow('Currency',        'INR',         'select'),
                mcBuildRow('Validity (Days)', '365',         'text'),
                mcBuildRow('Auto Top-Up',     'Disabled',    'select-toggle'),
                mcBuildRow('Min Top-Up Limit','₹ 1,000',    'text'),
                mcBuildRow('Max Top-Up Limit','₹ 5,00,000', 'text'),
            ].join('');
            var pricing = document.getElementById('mc-pricing-tbody');
            if (pricing) pricing.innerHTML = [
                mcBuildRow('Email (CPM)',    '₹ 1.50 / Email', 'text'),
                mcBuildRow('SMS (CPS)',      '₹ 0.25 / msg',       'text'),
                mcBuildRow('WhatsApp (CPS)','₹ 0.80 / msg',       'text'),
                mcBuildRow('AI Voice (CPS)','₹ 2.00 / call',      'text'),
                mcBuildRow('Billing Cycle', 'Monthly',             'text'),
                mcBuildRow('Pricing Model', 'Flat Rate',           'text'),
            ].join('');
        })();
        function rtToggleAcc(id) {
            var acc = document.getElementById(id);
            if (!acc) return;
            acc.classList.toggle('open');
            var ch = acc.querySelector('.rt-acc-chevron');
            if (ch) ch.innerHTML = acc.classList.contains('open') ? '&#8743;' : '&#8744;';
        }

        // Tag data
        var RT_DATA = {
            'opportunity': [
                { tag: 'Opportunity', singular: 'Opportunity', plural: 'Opportunities' }
            ],
            'applicant': [
                { tag: 'Applicant', singular: 'Applicant', plural: 'Applicants' }
            ],
            'institute': [
                { tag: 'Institute', singular: 'Institute', plural: 'Institutes' }
            ],
            'application': [
                { tag: 'Application',        singular: 'Application',       plural: 'Applications' },
                { tag: 'Application No',     singular: 'Application No',    plural: 'Applications No' },
                { tag: 'Application Manager',singular: 'Application Manager',plural: 'Applications Manager' },
                { tag: 'Unpaid Applications',singular: 'Unpaid Application', plural: 'Unpaid Applications' },
                { tag: 'Paid Application',   singular: 'Paid Application',  plural: 'Paid Applications' },
                { tag: 'Application Started',singular: 'Application Started',plural: 'Applications Started' },
                { tag: 'Application Submitted',singular:'Application Submitted',plural:'Applications Submitted' }
            ],
            'payment': [
                { tag: 'Payment',             singular: 'Payment',             plural: 'Payments' },
                { tag: 'Payment Manager',     singular: 'Payment Manager',     plural: 'Payments Manager' },
                { tag: 'Payment Initiated',   singular: 'Payment Initiated',   plural: 'Payment Initiated' },
                { tag: 'Payment Not Initiated',singular:'Payment Not Initiated',plural:'Payment Not Initiated' },
                { tag: 'Payment Approved',    singular: 'Payment Approved',    plural: 'Payment Approved' },
                { tag: 'Online Payment',      singular: 'Online Payment',      plural: 'Online Payment' },
                { tag: 'Offline Payment',     singular: 'Offline Payment',     plural: 'Offline Payment' },
                { tag: 'Payment Mode',        singular: 'Payment Mode',        plural: 'Payment Mode' },
                { tag: 'Payment Pending',     singular: 'Payment Pending',     plural: 'Payment Pending' },
                { tag: 'Payment Gateway',     singular: 'Payment Gateway',     plural: 'Payment Gateway' },
                { tag: 'Payment Rejected',    singular: 'Payment Rejected',    plural: 'Payment Rejected' }
            ]
        };

        function rtRenderAll() {
            Object.keys(RT_DATA).forEach(function(key) { rtRenderGroup(key); });
        }

        function rtRenderGroup(key) {
            var tbody = document.getElementById('rtb-' + key);
            if (!tbody) return;
            tbody.innerHTML = '';
            RT_DATA[key].forEach(function(row, idx) {
                var tr = document.createElement('tr');
                tr.dataset.key = key;
                tr.dataset.idx = idx;
                tr.innerHTML = rtViewRow(key, idx, row);
                tbody.appendChild(tr);
            });
        }

        function rtViewRow(key, idx, row) {
            return '<td><span class="rt-tag-chip">' + row.tag + '</span></td>' +
                   '<td class="rt-val-text">' + row.singular + '</td>' +
                   '<td class="rt-val-text">' + row.plural + '</td>' +
                   '<td style="text-align:right">' +
                     '<button class="rt-edit-link" onclick="rtEditRow(\'' + key + '\',' + idx + ')">' +
                       '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
                       'Edit' +
                     '</button>' +
                   '</td>';
        }

        function rtEditRow(key, idx) {
            var row = RT_DATA[key][idx];
            var tbody = document.getElementById('rtb-' + key);
            var tr = tbody.querySelectorAll('tr')[idx];
            tr.style.background = '#f5f8ff';
            tr.innerHTML =
                '<td><span class="rt-tag-chip">' + row.tag + '</span></td>' +
                '<td><input class="rt-input" id="rt-sin-' + key + idx + '" value="' + row.singular + '" placeholder="Singular name"></td>' +
                '<td><input class="rt-input" id="rt-plu-' + key + idx + '" value="' + row.plural + '" placeholder="Plural name"></td>' +
                '<td>' +
                  '<div class="rt-action-wrap">' +
                    '<button class="rt-save-btn" onclick="rtSaveRow(\'' + key + '\',' + idx + ')">Save</button>' +
                    '<button class="rt-cancel-btn" onclick="rtRenderGroup(\'' + key + '\')">Cancel</button>' +
                  '</div>' +
                '</td>';
            document.getElementById('rt-sin-' + key + idx).focus();
        }

        function rtSaveRow(key, idx) {
            var sin = document.getElementById('rt-sin-' + key + idx);
            var plu = document.getElementById('rt-plu-' + key + idx);
            if (sin) RT_DATA[key][idx].singular = sin.value;
            if (plu) RT_DATA[key][idx].plural   = plu.value;
            rtRenderGroup(key);
        }

        // Init on panel open
        var _origOpenRename = window.openRenameTagsView;
        window.openRenameTagsView = function() {
            _origOpenRename();
            setTimeout(rtRenderAll, 0);
        };
    

/* ─────────────────── */


        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        const tnDark = document.getElementById('tnDark');
        const settingsView = document.getElementById('settings-view');

        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            tnDark.classList.toggle('collapsed');
            settingsView.classList.toggle('sidebar-collapsed');
        });

        document.querySelectorAll('.sb-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                if (item.id === 'sb-comm-perf') {
                    if (window.openCommLogList) openCommLogList();
                    return;
                }
                // Close comm-log overlays when navigating to any other section
                var commLog = document.getElementById('comm-log-overlay');
                if (commLog && commLog.style.display !== 'none' && window.closeCommLog) closeCommLog();
                var commDetail = document.getElementById('comm-detail-overlay');
                if (commDetail && commDetail.style.display !== 'none' && window.closeCommDetail) closeCommDetail();
                var workflowOverlayNav = document.getElementById('workflow-overlay');
                if (workflowOverlayNav && workflowOverlayNav.style.display !== 'none' && window.closeWorkflowBuilder) closeWorkflowBuilder();
                var workflowDesignerNav = document.getElementById('workflow-designer-overlay');
                if (workflowDesignerNav && workflowDesignerNav.style.display !== 'none') workflowDesignerNav.style.display = 'none';
                // If it's not the usage item, show dashboard
                if (item.id !== 'sb-usage') {
                    showPage('dashboard');
                }
            });
        });

        const settingsBtn = document.getElementById('settingsBtn');

        const stgBackBtn = document.getElementById('stgBackBtn');
        const stgHome = document.getElementById('stgHome');
        const stgDetailWrap = document.getElementById('stgDetailWrap');

        settingsBtn.addEventListener('click', () => {
            // Close comm-log overlay if open so settings appears on top
            var commLog = document.getElementById('comm-log-overlay');
            if (commLog && commLog.style.display !== 'none') {
                if (window.closeCommLog) window.closeCommLog();
            }
            var commDetail = document.getElementById('comm-detail-overlay');
            if (commDetail && commDetail.style.display !== 'none') {
                if (window.closeCommDetail) window.closeCommDetail();
            }
            // Close METS overlay if open so settings appears on top
            var metsOverlay = document.getElementById('mets-overlay');
            if (metsOverlay && metsOverlay.style.display !== 'none') {
                if (window.closeMetsOverlay) closeMetsOverlay();
            }
            // Close Day Planner overlay if open so settings appears on top
            var dayPlannerOverlay = document.getElementById('day-planner-overlay');
            if (dayPlannerOverlay && dayPlannerOverlay.style.display !== 'none') {
                if (window.closeDayPlanner) closeDayPlanner();
            }
            // Close Workflow Builder overlays if open so settings appears on top
            var workflowOverlaySettings = document.getElementById('workflow-overlay');
            if (workflowOverlaySettings && workflowOverlaySettings.style.display !== 'none') {
                if (window.closeWorkflowBuilder) closeWorkflowBuilder();
            }
            var workflowDesignerSettings = document.getElementById('workflow-designer-overlay');
            if (workflowDesignerSettings && workflowDesignerSettings.style.display !== 'none') workflowDesignerSettings.style.display = 'none';
            settingsView.classList.add('open');
            // Sync sidebar collapse state if needed
            if (sidebar.classList.contains('collapsed')) {
                settingsView.classList.add('sidebar-collapsed');
            } else {
                settingsView.classList.remove('sidebar-collapsed');
            }
            var instSelBtn = document.querySelector('.institute-selector');
            if (instSelBtn) instSelBtn.style.display = '';
            stgHome.style.display = 'grid';
            stgDetailWrap.classList.remove('show');
            stgBackBtn.classList.remove('show'); var sep=document.getElementById('stgHdrSep'); if(sep) sep.style.display='none';
            var cb = document.getElementById('stgCustomizeBtn'); if(cb) cb.style.display = '';
        });

        stgBackBtn.addEventListener('click', function() {
            cancelToSettings();
        });

        function openSection(sectionId, accordionId) {
            if (sectionId === 'sec-account') { openOrgProfile(null); return; }
            // Show the section list, hide all panels
            hideAllPanels();
            // Explicitly hide non-section panels so they never bleed through
            ['org-profile-form','manage-accounts-view','account-notification-view','rename-tags-view','user-default-page-view','api-keys-view','mets-config-view'].forEach(function(id){
                var el = document.getElementById(id); if (el) el.style.display = 'none';
            });
            var dc = document.querySelector('.stg-detail-content');
            if (dc) {
                dc.style.display = 'block';
                // sec-mets manages its own internal scroll via rt-body; suppress outer scroll
                dc.style.overflow = (sectionId === 'sec-mets') ? 'hidden' : '';
            }
            stgHome.style.display = 'none';
            stgDetailWrap.classList.add('show');
            stgBackBtn.classList.add('show'); var sep=document.getElementById('stgHdrSep'); if(sep) sep.style.display='';
            document.querySelectorAll('.stg-section').forEach(sec => sec.style.display = 'none');
            // sec-mets uses flex-direction:row internally; must be shown as flex
            document.getElementById(sectionId).style.display = (sectionId === 'sec-mets') ? 'flex' : 'block';
            if (sectionId === 'sec-mets') setTimeout(mcRefreshLiveAudit, 50);
            const accordion = document.getElementById(accordionId);
            if (accordion) {
                accordion.classList.add('open');
                var accIt = document.getElementById('items-' + accordionId);
                if (accIt) accIt.classList.add('open');
            }
            // Highlight the matching acc-item in the sidebar
            document.querySelectorAll('.acc-item').forEach(function(i){ i.classList.remove('active'); });
            document.querySelectorAll('.acc-item').forEach(function(item){
                var onclick = item.getAttribute('onclick') || '';
                if (onclick.indexOf(sectionId) !== -1) item.classList.add('active');
            });
        }

        function toggleAccordion(accordionId, sectionId) {
            var accordion = document.getElementById(accordionId);
            if (accordion) accordion.classList.toggle('open');
            var items = document.getElementById('items-' + accordionId);
            if (items) items.classList.toggle('open');
        }

        function selectItem(el, sectionId) {
            document.querySelectorAll('.acc-item').forEach(item => item.classList.remove('active'));
            el.classList.add('active');
            document.querySelectorAll('.stg-section').forEach(sec => sec.style.display = 'none');
            var dc = document.querySelector('.stg-detail-content');
            if (dc) dc.style.overflow = (sectionId === 'sec-mets') ? 'hidden' : '';
            document.getElementById(sectionId).style.display = (sectionId === 'sec-mets') ? 'flex' : 'block';
            if (sectionId === 'sec-mets') setTimeout(mcRefreshLiveAudit, 50);
        }

        // ── Settings persistence (backend-backed) ─────────────────────────────────
        // Every settings row is keyed by "<enclosing section id>::<row name slug>" and
        // saved to /api/admin-settings (a generic key/value table), so Configure/Save
        // actions survive a page reload instead of only living in the DOM.
        var STG_SETTINGS_CACHE = {};

        function stgSlug(s) {
            return (s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
        }
        function stgRowKey(card) {
            var section = card.closest('.stg-section');
            var nameEl = card.querySelector('.stg-row-card-name');
            var sectionId = section ? section.id : 'unknown';
            var rowSlug = stgSlug(nameEl ? nameEl.textContent : 'row');
            return sectionId + '::' + rowSlug;
        }
        function stgSaveSetting(key, value) {
            STG_SETTINGS_CACHE[key] = value;
            fetch(API_BASE + '/api/admin-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings: (function(){ var o = {}; o[key] = value; return o; })() })
            }).catch(function(){});
        }
        function stgApplyCachedSettings() {
            document.querySelectorAll('.stg-section .stg-row-card').forEach(function(card) {
                if (card.classList.contains('stg-row-configure-panel')) return;
                var key = stgRowKey(card);
                var saved = STG_SETTINGS_CACHE[key];
                if (!saved || !saved.status) return;
                var statusEl = card.querySelector('[class^="stg-status-"]');
                if (!statusEl) return;
                var cls = saved.status === 'Configured' ? 'stg-status-configured'
                    : saved.status === 'Pending' ? 'stg-status-pending' : 'stg-status-inactive';
                statusEl.className = cls;
                statusEl.textContent = saved.status;
            });
        }
        function stgLoadAllSettings() {
            return fetch(API_BASE + '/api/admin-settings')
                .then(function(r){ return r.json(); })
                .then(function(data){ STG_SETTINGS_CACHE = (data && data.settings) || {}; stgApplyCachedSettings(); })
                .catch(function(){});
        }
        document.addEventListener('DOMContentLoaded', stgLoadAllSettings);

        // Every "Configure" button on a settings row card now genuinely opens up an
        // inline toggle + Save, right below that same card — same visual format,
        // no change to the surrounding grid/section/accordion design.
        function stgConfigureRow(btn) {
            var card = btn.closest('.stg-row-card');
            if (!card) return;
            var next = card.nextElementSibling;
            if (next && next.classList.contains('stg-row-configure-panel')) {
                next.remove();
                return;
            }
            var rows = card.parentElement;
            if (rows) {
                var openPanel = rows.querySelector('.stg-row-configure-panel');
                if (openPanel) openPanel.remove();
            }
            var nameEl = card.querySelector('.stg-row-card-name');
            var name = nameEl ? nameEl.textContent.trim() : 'this setting';
            var toggleLabel = btn.dataset && btn.dataset.toggleLabel ? btn.dataset.toggleLabel : ('Enable ' + name);
            var statusEl = card.querySelector('[class^="stg-status-"]');
            var isOn = !!(statusEl && statusEl.textContent.trim() === 'Configured');
            var panel = document.createElement('div');
            panel.className = 'stg-row-card stg-row-configure-panel';
            panel.innerHTML =
                '<div class="stg-row-card-left"><div class="stg-row-card-text"><div class="stg-row-card-name">' + toggleLabel + '</div></div></div>' +
                '<div class="stg-row-card-right" style="gap:14px;">' +
                    '<div class="mc-toggle' + (isOn ? ' on' : '') + '" onclick="this.classList.toggle(\'on\')"><div></div></div>' +
                    '<button class="stg-row-card-btn" style="border-color:#2979d4;color:#2979d4;" onclick="stgSaveRow(this)">Save</button>' +
                '</div>';
            card.insertAdjacentElement('afterend', panel);
        }

        function stgSaveRow(btn) {
            var panel = btn.closest('.stg-row-configure-panel');
            if (!panel) return;
            var card = panel.previousElementSibling;
            var isOn = !!panel.querySelector('.mc-toggle.on');
            if (card) {
                var statusEl = card.querySelector('[class^="stg-status-"]');
                if (statusEl) {
                    statusEl.className = isOn ? 'stg-status-configured' : 'stg-status-inactive';
                    statusEl.textContent = isOn ? 'Configured' : 'Not Set';
                }
                stgSaveSetting(stgRowKey(card), { on: isOn, status: isOn ? 'Configured' : 'Not Set' });
            }
            panel.remove();
        }

        // Bespoke inline-expand panel for CRM > Lead Flow > "Mobile Number validations"
        // (3 toggles, matches the real product's crawled Lead Flow tab) — reuses the
        // same .stg-row-card / .mc-toggle visual format as stgConfigureRow, no new CSS.
        function stgConfigureMobileValidations(btn) {
            var card = btn.closest('.stg-row-card');
            if (!card) return;
            var next = card.nextElementSibling;
            if (next && next.classList.contains('stg-row-configure-panel')) {
                next.remove();
                return;
            }
            var rows = card.parentElement;
            if (rows) {
                var openPanel = rows.querySelector('.stg-row-configure-panel');
                if (openPanel) openPanel.remove();
            }
            var toggles = [
                'Applicant Register with unique Mobile No.',
                'Do not allow duplicate mobile number lead from widget/Facebook Connector',
                'Do not allow duplicate mobile number lead from Client API'
            ];
            var saved = STG_SETTINGS_CACHE[stgRowKey(card)];
            var savedFlags = (saved && saved.toggles) || [];
            var panel = document.createElement('div');
            panel.className = 'stg-row-card stg-row-configure-panel';
            var rowsHtml = toggles.map(function (t, i) {
                var on = savedFlags.length ? !!savedFlags[i] : true;
                return '<div style="display:flex;align-items:center;justify-content:space-between;gap:14px;padding:8px 0;">' +
                    '<div class="stg-row-card-text" style="display:flex;align-items:center;gap:6px;"><div class="stg-row-card-name" style="font-weight:400;">' + t + '</div><span title="' + t + '" style="color:#9CA3AF;cursor:help;">&#9432;</span></div>' +
                    '<div class="mc-toggle' + (on ? ' on' : '') + '" onclick="this.classList.toggle(\'on\')"><div></div></div>' +
                '</div>';
            }).join('');
            panel.innerHTML =
                '<div style="width:100%;">' + rowsHtml +
                '<div style="display:flex;justify-content:flex-end;margin-top:10px;">' +
                    '<button class="stg-row-card-btn" style="border-color:#2979d4;color:#2979d4;" onclick="stgSaveMobileValidations(this)">Save</button>' +
                '</div></div>';
            card.insertAdjacentElement('afterend', panel);
        }

        function stgSaveMobileValidations(btn) {
            var panel = btn.closest('.stg-row-configure-panel');
            if (!panel) return;
            var card = panel.previousElementSibling;
            var toggleEls = panel.querySelectorAll('.mc-toggle');
            var flags = Array.prototype.map.call(toggleEls, function (t) { return t.classList.contains('on'); });
            var anyOn = flags.some(function (f) { return f; });
            if (card) {
                var statusEl = card.querySelector('[class^="stg-status-"]');
                if (statusEl) {
                    statusEl.className = anyOn ? 'stg-status-configured' : 'stg-status-inactive';
                    statusEl.textContent = anyOn ? 'Configured' : 'Not Set';
                }
                stgSaveSetting(stgRowKey(card), { toggles: flags, status: anyOn ? 'Configured' : 'Not Set' });
            }
            panel.remove();
        }

        // Bespoke inline-expand panel for CRM > Lead Flow > "Registration Attempt configurations"
        // — real table + "Points to Note" copy crawled from the product, same card format.
        function stgConfigureRegAttempt(btn) {
            var card = btn.closest('.stg-row-card');
            if (!card) return;
            var next = card.nextElementSibling;
            if (next && next.classList.contains('stg-row-configure-panel')) {
                next.remove();
                return;
            }
            var rows = card.parentElement;
            if (rows) {
                var openPanel = rows.querySelector('.stg-row-configure-panel');
                if (openPanel) openPanel.remove();
            }
            var tableRows = [
                ['Add Quick Lead', 'Lead Create Only'],
                ['Widget', ''],
                ['Landing Page', 'Lead Create or Upd...'],
                ['Telephony Inbound', 'Only First Call'],
                ['Facebook Lead', 'Lead Create or Upd...'],
                ['Google Lead', 'Lead Create or Upd...'],
                ['Zapier Lead', 'Lead Create Only'],
                ['Application Manager (Upload Single Application)', 'Never']
            ];
            var trHtml = tableRows.map(function (r) {
                return '<tr><td style="padding:8px 10px;border-bottom:1px solid #EEF0F3;">' + r[0] + '</td>' +
                    '<td style="padding:8px 10px;border-bottom:1px solid #EEF0F3;">' + (r[1] || '&mdash;') + '</td>' +
                    '<td style="padding:8px 10px;border-bottom:1px solid #EEF0F3;color:#9CA3AF;">&mdash;</td>' +
                    '<td style="padding:8px 10px;border-bottom:1px solid #EEF0F3;color:#9CA3AF;">&mdash;</td></tr>';
            }).join('');
            var panel = document.createElement('div');
            panel.className = 'stg-row-card stg-row-configure-panel';
            panel.innerHTML =
                '<div style="width:100%;">' +
                '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:13px;">' +
                    '<thead><tr style="background:#F9FAFB;">' +
                        '<th style="text-align:left;padding:8px 10px;">Lead InFlow</th>' +
                        '<th style="text-align:left;padding:8px 10px;">Registration Attempt</th>' +
                        '<th style="text-align:left;padding:8px 10px;">Modified On</th>' +
                        '<th style="text-align:left;padding:8px 10px;">Modified By</th>' +
                    '</tr></thead><tbody>' + trHtml + '</tbody></table></div>' +
                '<div style="margin-top:12px;padding:12px 14px;border:1px solid #BFDBFE;background:#EFF6FF;border-radius:6px;font-size:12.5px;color:#374151;line-height:1.6;">' +
                    '<div style="font-weight:600;margin-bottom:6px;color:#1D4ED8;">Points to Note</div>' +
                    'APIs / Users can use a registration attempt field key to pass on a registration attempt when sending hits via API. Use the key <code>field_registration_attempt</code> in your API payloads: If the <code>field_registration_attempt</code> is present, its value will increment the registration attempt count. If not present, the system will follow existing logic (e.g. Count on Creation, Count on Creation and Update, Never). Values passed here: Yes | No. This field is optional and maintains backward compatibility.<br><br>' +
                    'Bulk Offline Upload &mdash; Use the &quot;Field Registration Attempt&quot; key to pass a registration attempt during Bulk Offline Upload. Refer to Bulk Offline Upload guidelines for details.' +
                '</div>' +
                '<div style="display:flex;justify-content:flex-end;margin-top:10px;">' +
                    '<button class="stg-row-card-btn" style="border-color:#2979d4;color:#2979d4;" onclick="stgSaveRow(this)">Save</button>' +
                '</div></div>';
            card.insertAdjacentElement('afterend', panel);
        }

        // Closes a configure panel without altering the row's status badge —
        // used by field-only panels that have no single on/off toggle to reflect back.
        function stgCloseConfigurePanel(btn) {
            var panel = btn.closest('.stg-row-configure-panel');
            if (panel) panel.remove();
        }

        // Bespoke inline-expand panel for Security & Compliance > "Login Methods"
        // — matches the real product's crawled Login Methods tab (Meritto Login + 2FA toggle).
        function stgConfigureLoginMethods(btn) {
            var card = btn.closest('.stg-row-card');
            if (!card) return;
            var next = card.nextElementSibling;
            if (next && next.classList.contains('stg-row-configure-panel')) { next.remove(); return; }
            var rows = card.parentElement;
            if (rows) { var openPanel = rows.querySelector('.stg-row-configure-panel'); if (openPanel) openPanel.remove(); }
            var saved = STG_SETTINGS_CACHE[stgRowKey(card)];
            var twoFAOn = saved ? !!saved.twoFactorEnabled : false;
            var panel = document.createElement('div');
            panel.className = 'stg-row-card stg-row-configure-panel';
            panel.innerHTML =
                '<div style="width:100%;">' +
                    '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #EEF0F3;">' +
                        '<div class="stg-row-card-text"><div class="stg-row-card-name" style="font-weight:400;">Meritto Login</div><div class="stg-row-card-desc">Users can use their email ID and password to log into their Meritto account.</div></div>' +
                    '</div>' +
                    '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;">' +
                        '<div class="stg-row-card-text"><div class="stg-row-card-name" style="font-weight:400;">Enable Two-factor authentication</div><div class="stg-row-card-desc">When this is selected all users are required to use Email 2FA in login.</div></div>' +
                        '<div class="mc-toggle' + (twoFAOn ? ' on' : '') + '" onclick="this.classList.toggle(\'on\')"><div></div></div>' +
                    '</div>' +
                    '<div style="display:flex;justify-content:flex-end;margin-top:10px;">' +
                        '<button class="stg-row-card-btn" style="border-color:#2979d4;color:#2979d4;" onclick="stgSaveLoginMethods(this)">Save</button>' +
                    '</div>' +
                '</div>';
            card.insertAdjacentElement('afterend', panel);
        }

        function stgSaveLoginMethods(btn) {
            var panel = btn.closest('.stg-row-configure-panel');
            if (!panel) return;
            var card = panel.previousElementSibling;
            var twoFAOn = !!panel.querySelector('.mc-toggle.on');
            if (card) {
                var statusEl = card.querySelector('[class^="stg-status-"]');
                if (statusEl) { statusEl.className = 'stg-status-configured'; statusEl.textContent = 'Configured'; }
                stgSaveSetting(stgRowKey(card), { twoFactorEnabled: twoFAOn, status: 'Configured' });
            }
            panel.remove();
        }

        // Bespoke inline-expand panel for Security & Compliance > "Session"
        // — matches the real product's Session tab (idle session timeout dropdown).
        function stgConfigureSession(btn) {
            var card = btn.closest('.stg-row-card');
            if (!card) return;
            var next = card.nextElementSibling;
            if (next && next.classList.contains('stg-row-configure-panel')) { next.remove(); return; }
            var rows = card.parentElement;
            if (rows) { var openPanel = rows.querySelector('.stg-row-configure-panel'); if (openPanel) openPanel.remove(); }
            var saved = STG_SETTINGS_CACHE[stgRowKey(card)];
            var savedTimeout = (saved && saved.timeout) || 'Never';
            var opts = ['Never', '15 minutes', '30 minutes', '1 hour', '4 hours', '8 hours'];
            var optsHtml = opts.map(function (o) { return '<option' + (o === savedTimeout ? ' selected' : '') + '>' + o + '</option>'; }).join('');
            var panel = document.createElement('div');
            panel.className = 'stg-row-card stg-row-configure-panel';
            panel.innerHTML =
                '<div style="width:100%;">' +
                    '<div class="stg-row-card-text"><div class="stg-row-card-name" style="font-weight:400;">Idle Session Timeout</div><div class="stg-row-card-desc">Triggers automatic logout after a defined period of user inactivity to protect sensitive information.</div></div>' +
                    '<select id="stgSessionTimeoutSelect" style="margin-top:10px;padding:8px 10px;border:1px solid #E2E8F0;border-radius:6px;font-size:13px;color:#334155;background:#fff;">' + optsHtml + '</select>' +
                    '<div style="display:flex;justify-content:flex-end;margin-top:14px;">' +
                        '<button class="stg-row-card-btn" style="border-color:#2979d4;color:#2979d4;" onclick="stgSaveSession(this)">Save</button>' +
                    '</div>' +
                '</div>';
            card.insertAdjacentElement('afterend', panel);
        }

        function stgSaveSession(btn) {
            var panel = btn.closest('.stg-row-configure-panel');
            if (!panel) return;
            var card = panel.previousElementSibling;
            var select = panel.querySelector('#stgSessionTimeoutSelect');
            var timeout = select ? select.value : 'Never';
            var isSet = timeout !== 'Never';
            if (card) {
                var statusEl = card.querySelector('[class^="stg-status-"]');
                if (statusEl) {
                    statusEl.className = isSet ? 'stg-status-configured' : 'stg-status-inactive';
                    statusEl.textContent = isSet ? 'Configured' : 'Not Set';
                }
                stgSaveSetting(stgRowKey(card), { timeout: timeout, status: isSet ? 'Configured' : 'Not Set' });
            }
            panel.remove();
        }

        // Bespoke inline-expand panel for Account Setup > "Limits"
        // — reflects the real product's Report Builder/Opportunity/Field Sync/Campaign limits.
        function stgConfigureLimits(btn) {
            var card = btn.closest('.stg-row-card');
            if (!card) return;
            var next = card.nextElementSibling;
            if (next && next.classList.contains('stg-row-configure-panel')) { next.remove(); return; }
            var rows = card.parentElement;
            if (rows) { var openPanel = rows.querySelector('.stg-row-configure-panel'); if (openPanel) openPanel.remove(); }
            var fields = [
                ['No. of Reports Allowed', ''],
                ['No of Dashboards', ''],
                ['No. of Dashlets in a Dashboard', ''],
                ['No of Custom Metrics', ''],
                ['Limit of Opportunity List', '50'],
                ['Limit of Active Opportunity List', '50'],
                ['Limit of Fields in an Opportunity List', '150'],
                ['Limit of Campaign', '100']
            ];
            var saved = STG_SETTINGS_CACHE[stgRowKey(card)];
            var savedVals = (saved && saved.values) || [];
            var rowsHtml = fields.map(function (f, i) {
                var val = (savedVals[i] !== undefined && savedVals[i] !== '') ? savedVals[i] : f[1];
                return '<div style="display:flex;align-items:center;justify-content:space-between;gap:14px;padding:7px 0;">' +
                    '<div class="stg-row-card-text"><div class="stg-row-card-name" style="font-weight:400;">' + f[0] + '</div></div>' +
                    '<input type="text" value="' + val + '" placeholder="Enter value" style="width:120px;padding:6px 8px;border:1px solid #E2E8F0;border-radius:6px;font-size:13px;text-align:right;">' +
                '</div>';
            }).join('');
            var panel = document.createElement('div');
            panel.className = 'stg-row-card stg-row-configure-panel';
            panel.innerHTML =
                '<div style="width:100%;">' + rowsHtml +
                '<div style="display:flex;justify-content:flex-end;margin-top:10px;">' +
                    '<button class="stg-row-card-btn" style="border-color:#2979d4;color:#2979d4;" onclick="stgSaveLimits(this)">Save</button>' +
                '</div></div>';
            card.insertAdjacentElement('afterend', panel);
        }

        function stgSaveLimits(btn) {
            var panel = btn.closest('.stg-row-configure-panel');
            if (!panel) return;
            var card = panel.previousElementSibling;
            var inputs = panel.querySelectorAll('input[type="text"]');
            var values = Array.prototype.map.call(inputs, function (i) { return i.value; });
            var anySet = values.some(function (v) { return v !== ''; });
            if (card) {
                var statusEl = card.querySelector('[class^="stg-status-"]');
                if (statusEl) {
                    statusEl.className = anySet ? 'stg-status-configured' : 'stg-status-inactive';
                    statusEl.textContent = anySet ? 'Configured' : 'Not Set';
                }
                stgSaveSetting(stgRowKey(card), { values: values, status: anySet ? 'Configured' : 'Not Set' });
            }
            panel.remove();
        }

        // Bespoke inline-expand panel for Account Setup > "Telephony Version Config"
        function stgConfigureTelephonyVersion(btn) {
            var card = btn.closest('.stg-row-card');
            if (!card) return;
            var next = card.nextElementSibling;
            if (next && next.classList.contains('stg-row-configure-panel')) { next.remove(); return; }
            var rows = card.parentElement;
            if (rows) { var openPanel = rows.querySelector('.stg-row-configure-panel'); if (openPanel) openPanel.remove(); }
            var saved = STG_SETTINGS_CACHE[stgRowKey(card)];
            var savedVersion = (saved && saved.version) || 'Select';
            var vOpts = ['Select', 'V1', 'V2'].map(function (o) { return '<option' + (o === savedVersion ? ' selected' : '') + '>' + o + '</option>'; }).join('');
            var panel = document.createElement('div');
            panel.className = 'stg-row-card stg-row-configure-panel';
            panel.innerHTML =
                '<div style="width:100%;">' +
                    '<div style="padding:10px 14px;border:1px solid #BFDBFE;background:#EFF6FF;border-radius:6px;font-size:12.5px;color:#374151;margin-bottom:14px;">' +
                        '<strong>Call Note:</strong> Upgrading from V1 to V2 (or vice versa) will impact your integration, requiring changes to all endpoints and to be re-configured on the vendor panel.' +
                    '</div>' +
                    '<div class="stg-row-card-text"><div class="stg-row-card-name" style="font-weight:400;">Version</div></div>' +
                    '<select id="stgTelephonyVersionSelect" style="margin-top:8px;padding:8px 10px;border:1px solid #E2E8F0;border-radius:6px;font-size:13px;color:#334155;background:#fff;">' + vOpts + '</select>' +
                    '<div style="display:flex;justify-content:flex-end;margin-top:14px;">' +
                        '<button class="stg-row-card-btn" style="border-color:#2979d4;color:#2979d4;" onclick="stgSaveTelephonyVersion(this)">Save</button>' +
                    '</div>' +
                '</div>';
            card.insertAdjacentElement('afterend', panel);
        }

        function stgSaveTelephonyVersion(btn) {
            var panel = btn.closest('.stg-row-configure-panel');
            if (!panel) return;
            var card = panel.previousElementSibling;
            var select = panel.querySelector('#stgTelephonyVersionSelect');
            var version = select ? select.value : 'Select';
            var isSet = version !== 'Select';
            if (card) {
                var statusEl = card.querySelector('[class^="stg-status-"]');
                if (statusEl) {
                    statusEl.className = isSet ? 'stg-status-configured' : 'stg-status-inactive';
                    statusEl.textContent = isSet ? 'Configured' : 'Not Set';
                }
                stgSaveSetting(stgRowKey(card), { version: version, status: isSet ? 'Configured' : 'Not Set' });
            }
            panel.remove();
        }

        // Selects one Business Hours tile (24x7 / 24x5 / Custom) and clears the others —
        // used by the bespoke Business Hours configure panel below.
        function stgSelectBizHourTile(el) {
            var siblings = el.parentElement.children;
            for (var i = 0; i < siblings.length; i++) {
                siblings[i].style.borderColor = '#E2E8F0';
                siblings[i].style.background = '#fff';
                siblings[i].style.color = '#64748B';
                siblings[i].style.fontWeight = '400';
            }
            el.style.borderColor = '#2979d4';
            el.style.background = '#EFF6FF';
            el.style.color = '#2979d4';
            el.style.fontWeight = '600';
        }

        // Bespoke inline-expand panel for Account Setup > "Business Hours"
        function stgConfigureBusinessHours(btn) {
            var card = btn.closest('.stg-row-card');
            if (!card) return;
            var next = card.nextElementSibling;
            if (next && next.classList.contains('stg-row-configure-panel')) { next.remove(); return; }
            var rows = card.parentElement;
            if (rows) { var openPanel = rows.querySelector('.stg-row-configure-panel'); if (openPanel) openPanel.remove(); }
            var saved = STG_SETTINGS_CACHE[stgRowKey(card)];
            var savedMode = (saved && saved.mode) || '24 hours / 7';
            var savedWeekStart = (saved && saved.weekStart) || 'Monday';
            var tileBase = 'flex:1;text-align:center;padding:14px 8px;border-radius:8px;cursor:pointer;font-size:12.5px;border:1px solid #E2E8F0;color:#64748B;';
            var tileActive = 'border-color:#2979d4;background:#EFF6FF;color:#2979d4;font-weight:600;';
            var modes = ['24 hours / 7', '24 hours / 5', 'Custom hours'];
            var tilesHtml = modes.map(function (m) {
                return '<div onclick="stgSelectBizHourTile(this)" style="' + tileBase + (m === savedMode ? tileActive : '') + '">' + m + '</div>';
            }).join('');
            var weekOpts = ['Monday', 'Sunday'].map(function (o) { return '<option' + (o === savedWeekStart ? ' selected' : '') + '>' + o + '</option>'; }).join('');
            var panel = document.createElement('div');
            panel.className = 'stg-row-card stg-row-configure-panel';
            panel.innerHTML =
                '<div style="width:100%;">' +
                    '<div style="display:flex;gap:12px;margin-bottom:16px;">' + tilesHtml + '</div>' +
                    '<div class="stg-row-card-text"><div class="stg-row-card-name" style="font-weight:400;">Week Starts on</div></div>' +
                    '<select id="stgBizHoursWeekStart" style="margin-top:8px;padding:8px 10px;border:1px solid #E2E8F0;border-radius:6px;font-size:13px;color:#334155;background:#fff;">' + weekOpts + '</select>' +
                    '<div style="display:flex;justify-content:flex-end;margin-top:14px;">' +
                        '<button class="stg-row-card-btn" style="border-color:#2979d4;color:#2979d4;" onclick="stgSaveBusinessHours(this)">Save</button>' +
                    '</div>' +
                '</div>';
            card.insertAdjacentElement('afterend', panel);
        }

        function stgSaveBusinessHours(btn) {
            var panel = btn.closest('.stg-row-configure-panel');
            if (!panel) return;
            var card = panel.previousElementSibling;
            var tiles = panel.querySelectorAll('div[onclick^="stgSelectBizHourTile"]');
            var activeTile = Array.prototype.find.call(tiles, function (t) { return t.style.fontWeight === '600'; });
            var mode = activeTile ? activeTile.textContent.trim() : '24 hours / 7';
            var weekStart = panel.querySelector('#stgBizHoursWeekStart');
            if (card) {
                var statusEl = card.querySelector('[class^="stg-status-"]');
                if (statusEl) { statusEl.className = 'stg-status-configured'; statusEl.textContent = 'Configured'; }
                stgSaveSetting(stgRowKey(card), { mode: mode, weekStart: weekStart ? weekStart.value : 'Monday', status: 'Configured' });
            }
            panel.remove();
        }

        // Bespoke inline-expand panel for Account Setup > "Allocation Quota"
        function stgConfigureAllocationQuota(btn) {
            var card = btn.closest('.stg-row-card');
            if (!card) return;
            var next = card.nextElementSibling;
            if (next && next.classList.contains('stg-row-configure-panel')) { next.remove(); return; }
            var rows = card.parentElement;
            if (rows) { var openPanel = rows.querySelector('.stg-row-configure-panel'); if (openPanel) openPanel.remove(); }
            var saved = STG_SETTINGS_CACHE[stgRowKey(card)];
            var savedFlags = (saved && saved.toggles) || [false, false, false];
            var hierarchyLabels = [
                'Show only Reportees name to Managers while Reassigning leads',
                'Show only Reportees name to Managers while Reassigning Applications',
                'Show only Reportees name to Managers while Reassigning Opportunities'
            ];
            var hierarchyHtml = hierarchyLabels.map(function (label, i) {
                return '<div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;"><div class="stg-row-card-text"><div class="stg-row-card-name" style="font-weight:400;">' + label + '</div></div><div class="mc-toggle' + (savedFlags[i] ? ' on' : '') + '" onclick="this.classList.toggle(\'on\')"><div></div></div></div>';
            }).join('');
            var panel = document.createElement('div');
            panel.className = 'stg-row-card stg-row-configure-panel';
            panel.innerHTML =
                '<div style="width:100%;">' +
                    '<div class="stg-row-card-text" style="margin-bottom:6px;"><div class="stg-row-card-name" style="font-weight:600;">Hierarchy Allocation</div></div>' +
                    hierarchyHtml +
                    '<div style="margin-top:12px;padding-top:12px;border-top:1px solid #EEF0F3;font-size:12.5px;color:#6B7280;">Lead &amp; Application Allocation Quota let you cap how many leads/applications a user can hold, by user or by permission level. No allocation flow has been created yet.</div>' +
                    '<div style="display:flex;justify-content:flex-end;margin-top:14px;">' +
                        '<button class="stg-row-card-btn" style="border-color:#2979d4;color:#2979d4;" onclick="stgSaveAllocationQuota(this)">Save</button>' +
                    '</div>' +
                '</div>';
            card.insertAdjacentElement('afterend', panel);
        }

        function stgSaveAllocationQuota(btn) {
            var panel = btn.closest('.stg-row-configure-panel');
            if (!panel) return;
            var card = panel.previousElementSibling;
            var toggleEls = panel.querySelectorAll('.mc-toggle');
            var flags = Array.prototype.map.call(toggleEls, function (t) { return t.classList.contains('on'); });
            var anyOn = flags.some(function (f) { return f; });
            if (card) {
                var statusEl = card.querySelector('[class^="stg-status-"]');
                if (statusEl) {
                    statusEl.className = anyOn ? 'stg-status-configured' : 'stg-status-inactive';
                    statusEl.textContent = anyOn ? 'Configured' : 'Not Set';
                }
                stgSaveSetting(stgRowKey(card), { toggles: flags, status: anyOn ? 'Configured' : 'Not Set' });
            }
            panel.remove();
        }

        // Bespoke inline-expand panel for Account Setup > "Check-In/Check-Out"
        function stgConfigureCheckInOut(btn) {
            var card = btn.closest('.stg-row-card');
            if (!card) return;
            var next = card.nextElementSibling;
            if (next && next.classList.contains('stg-row-configure-panel')) { next.remove(); return; }
            var rows = card.parentElement;
            if (rows) { var openPanel = rows.querySelector('.stg-row-configure-panel'); if (openPanel) openPanel.remove(); }
            var saved = STG_SETTINGS_CACHE[stgRowKey(card)];
            var savedFlags = (saved && saved.toggles) || [false, false];
            var panel = document.createElement('div');
            panel.className = 'stg-row-card stg-row-configure-panel';
            panel.innerHTML =
                '<div style="width:100%;">' +
                    '<div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;"><div class="stg-row-card-text"><div class="stg-row-card-name" style="font-weight:400;">Enable Check-in/ check-out pop up</div></div><div class="mc-toggle' + (savedFlags[0] ? ' on' : '') + '" onclick="this.classList.toggle(\'on\')"><div></div></div></div>' +
                    '<div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;"><div class="stg-row-card-text"><div class="stg-row-card-name" style="font-weight:400;">Enable Auto Check-In/Auto Check-Out</div><div class="stg-row-card-desc">If turned off, users must check-in manually. The system will automatically check them out at 11:59 PM by default.</div></div><div class="mc-toggle' + (savedFlags[1] ? ' on' : '') + '" onclick="this.classList.toggle(\'on\')"><div></div></div></div>' +
                    '<div style="display:flex;justify-content:flex-end;margin-top:14px;">' +
                        '<button class="stg-row-card-btn" style="border-color:#2979d4;color:#2979d4;" onclick="stgSaveCheckInOut(this)">Save</button>' +
                    '</div>' +
                '</div>';
            card.insertAdjacentElement('afterend', panel);
        }

        function stgSaveCheckInOut(btn) {
            var panel = btn.closest('.stg-row-configure-panel');
            if (!panel) return;
            var card = panel.previousElementSibling;
            var toggleEls = panel.querySelectorAll('.mc-toggle');
            var flags = Array.prototype.map.call(toggleEls, function (t) { return t.classList.contains('on'); });
            var anyOn = flags.some(function (f) { return f; });
            if (card) {
                var statusEl = card.querySelector('[class^="stg-status-"]');
                if (statusEl) {
                    statusEl.className = anyOn ? 'stg-status-configured' : 'stg-status-inactive';
                    statusEl.textContent = anyOn ? 'Configured' : 'Not Set';
                }
                stgSaveSetting(stgRowKey(card), { toggles: flags, status: anyOn ? 'Configured' : 'Not Set' });
            }
            panel.remove();
        }

        // Real data crawled from CRM > Lead Stage > "Lead Stage and Sub stage Configurations".
        var LEAD_STAGES = [
            { name: 'Cold', score: -10, subs: ['Asked To Call Back'] },
            { name: 'Warm', score: 10, subs: ['Asked To Call Back'] },
            { name: 'Hot', score: 10, subs: ['Will Submit Soon', 'Asked To Call Back'] },
            { name: 'Submitted', score: 10, subs: ['Application Submitted'] },
            { name: 'Closed', score: -10, subs: ['Invalid Email', 'Not interested', 'Wrong Number', 'Taken Admission Elsewhere'] },
            { name: 'Not Reachable', score: 0, subs: ['Number Busy', 'Number Switched Off', 'Not Picking'] }
        ];
        var stgLeadStageNextIdx = LEAD_STAGES.length;

        function stgLeadScoreOptions(sel) {
            var out = '';
            for (var i = 10; i >= -10; i--) { out += '<option' + (i === sel ? ' selected' : '') + '>' + i + '</option>'; }
            return out;
        }

        // Swaps a stage/sub-stage name between its read-only label and an editable
        // text input — mirrors the real product's pencil-to-checkmark save affordance.
        function stgEditLeadStageName(el) {
            var wrap = el.parentElement;
            var span = wrap.querySelector('.stg-lstage-name-text');
            var input = wrap.querySelector('.stg-lstage-name-input');
            if (!span || !input) return;
            if (input.style.display === 'none') {
                input.style.display = '';
                input.value = span.textContent;
                input.focus();
                span.style.display = 'none';
                el.innerHTML = '&#10003;';
            } else {
                span.textContent = input.value;
                span.style.display = '';
                input.style.display = 'none';
                el.innerHTML = '&#9998;';
            }
        }

        function stgToggleLeadSubstages(el, idx) {
            var rows = document.querySelectorAll('.stg-lstage-sub-' + idx);
            var showing = rows.length && rows[0].style.display !== 'none';
            rows.forEach(function (r) { r.style.display = showing ? 'none' : ''; });
            el.style.transform = showing ? '' : 'rotate(180deg)';
        }

        function stgAddLeadSubstage(el, idx) {
            var tr = el.closest('tr');
            var newRow = document.createElement('tr');
            newRow.className = 'stg-lstage-sub-' + idx;
            newRow.style.background = '#FAFBFC';
            newRow.innerHTML =
                '<td style="padding:8px 10px 8px 34px;color:#475569;">&#8627; <input type="text" placeholder="New sub stage" style="border:none;border-bottom:1px solid #E2E8F0;background:transparent;font-size:13px;color:#334155;padding:2px 4px;"></td>' +
                '<td style="padding:8px 10px;"><select style="padding:6px 8px;border:1px solid #E2E8F0;border-radius:6px;font-size:12.5px;"><option>No</option><option>Yes</option></select></td>' +
                '<td></td><td></td>' +
                '<td style="padding:8px 10px;"><div class="mc-toggle on" onclick="this.classList.toggle(\'on\')"><div></div></div></td>' +
                '<td></td>';
            tr.parentElement.insertBefore(newRow, tr);
        }

        function stgAddLeadStage() {
            var idx = stgLeadStageNextIdx++;
            var tbody = document.getElementById('stgLeadStageBody');
            if (!tbody) return;
            var tr = document.createElement('tr');
            tr.style.borderTop = '1px solid #EEF0F3';
            tr.innerHTML =
                '<td style="padding:10px;"><div style="display:flex;align-items:center;gap:8px;"><span style="color:#CBD5E1;">&#8942;&#8942;</span>' +
                    '<div><span class="stg-lstage-name-text" style="font-weight:600;">New Stage</span><input class="stg-lstage-name-input" type="text" value="New Stage" style="display:none;border:none;border-bottom:1px solid #2979d4;font-size:13px;font-weight:600;color:#334155;width:120px;"> <span onclick="stgEditLeadStageName(this)" style="cursor:pointer;color:#9CA3AF;font-size:11px;">&#9998;</span><div style="font-size:11.5px;color:#9CA3AF;">0 Substage</div></div></div></td>' +
                '<td style="padding:10px;"><select style="padding:6px 8px;border:1px solid #E2E8F0;border-radius:6px;font-size:12.5px;"><option>No</option><option>Yes</option></select></td>' +
                '<td style="padding:10px;"><select style="padding:6px 8px;border:1px solid #E2E8F0;border-radius:6px;font-size:12.5px;"><option>No</option><option>Yes</option></select></td>' +
                '<td style="padding:10px;"><select style="padding:6px 8px;border:1px solid #E2E8F0;border-radius:6px;font-size:12.5px;">' + stgLeadScoreOptions(0) + '</select></td>' +
                '<td style="padding:10px;"><div class="mc-toggle on" onclick="this.classList.toggle(\'on\')"><div></div></div></td>' +
                '<td style="padding:10px;text-align:right;"><span onclick="stgToggleLeadSubstages(this,' + idx + ')" style="cursor:pointer;color:#6B7280;">&#9662;</span></td>';
            var addSubRow = document.createElement('tr');
            addSubRow.className = 'stg-lstage-sub-' + idx;
            addSubRow.style.display = 'none';
            addSubRow.style.background = '#FAFBFC';
            addSubRow.innerHTML = '<td colspan="6" style="padding:6px 10px 12px 34px;"><a href="javascript:void(0)" onclick="stgAddLeadSubstage(this,' + idx + ')" style="font-size:12.5px;color:#2979d4;text-decoration:none;">+ Add New Sub Stage</a></td>';
            tbody.appendChild(tr);
            tbody.appendChild(addSubRow);
        }

        // Bespoke inline-expand panel for CRM > Lead Stage > "Lead Stage and Sub stage Configurations"
        // — full drag-ordered stage/sub-stage builder matching the real product's crawled UI.
        // Normalizes a stage's `subs` entries to {name, followUp, active} objects —
        // the static LEAD_STAGES seed data uses plain strings, saved/restored data uses objects.
        function stgNormalizeSubs(subs) {
            return (subs || []).map(function (s) {
                return (typeof s === 'string') ? { name: s, followUp: 'No', active: true } : s;
            });
        }

        function stgConfigureLeadStages(btn) {
            var card = btn.closest('.stg-row-card');
            if (!card) return;
            var next = card.nextElementSibling;
            if (next && next.classList.contains('stg-row-configure-panel')) { next.remove(); return; }
            var rows = card.parentElement;
            if (rows) { var openPanel = rows.querySelector('.stg-row-configure-panel'); if (openPanel) openPanel.remove(); }

            var saved = STG_SETTINGS_CACHE[stgRowKey(card)];
            var stagesData = (saved && saved.stages && saved.stages.length) ? saved.stages : LEAD_STAGES;

            var bodyHtml = stagesData.map(function (st, i) {
                var subs = stgNormalizeSubs(st.subs);
                var followUp = st.followUp || 'No';
                var subReq = st.subStageRequired || 'No';
                var active = (st.active !== undefined) ? st.active : true;
                var yn = function (sel) { return '<option' + (sel === 'No' ? ' selected' : '') + '>No</option><option' + (sel === 'Yes' ? ' selected' : '') + '>Yes</option>'; };
                var stageRow =
                    '<tr style="border-top:1px solid #EEF0F3;">' +
                        '<td style="padding:10px;"><div style="display:flex;align-items:center;gap:8px;"><span style="color:#CBD5E1;">&#8942;&#8942;</span>' +
                            '<div><span class="stg-lstage-name-text" style="font-weight:600;">' + st.name + '</span><input class="stg-lstage-name-input" type="text" value="' + st.name + '" style="display:none;border:none;border-bottom:1px solid #2979d4;font-size:13px;font-weight:600;color:#334155;width:120px;"> <span onclick="stgEditLeadStageName(this)" style="cursor:pointer;color:#9CA3AF;font-size:11px;">&#9998;</span><div style="font-size:11.5px;color:#9CA3AF;">' + subs.length + ' Substage' + (subs.length !== 1 ? 's' : '') + '</div></div></div></td>' +
                        '<td style="padding:10px;"><select style="padding:6px 8px;border:1px solid #E2E8F0;border-radius:6px;font-size:12.5px;">' + yn(followUp) + '</select></td>' +
                        '<td style="padding:10px;"><select style="padding:6px 8px;border:1px solid #E2E8F0;border-radius:6px;font-size:12.5px;">' + yn(subReq) + '</select></td>' +
                        '<td style="padding:10px;"><select style="padding:6px 8px;border:1px solid #E2E8F0;border-radius:6px;font-size:12.5px;">' + stgLeadScoreOptions(st.score) + '</select></td>' +
                        '<td style="padding:10px;"><div class="mc-toggle' + (active ? ' on' : '') + '" onclick="this.classList.toggle(\'on\')"><div></div></div></td>' +
                        '<td style="padding:10px;text-align:right;"><span onclick="stgToggleLeadSubstages(this,' + i + ')" style="cursor:pointer;color:#6B7280;">&#9662;</span></td>' +
                    '</tr>';
                var subRows = subs.map(function (sub) {
                    return '<tr class="stg-lstage-sub-' + i + '" style="display:none;background:#FAFBFC;">' +
                        '<td style="padding:8px 10px 8px 34px;color:#475569;">&#8627; <span class="stg-lstage-name-text">' + sub.name + '</span><input class="stg-lstage-name-input" type="text" value="' + sub.name + '" style="display:none;border:none;border-bottom:1px solid #2979d4;font-size:13px;color:#334155;"> <span onclick="stgEditLeadStageName(this)" style="cursor:pointer;color:#9CA3AF;font-size:11px;">&#9998;</span></td>' +
                        '<td style="padding:8px 10px;"><select style="padding:6px 8px;border:1px solid #E2E8F0;border-radius:6px;font-size:12.5px;">' + yn(sub.followUp || 'No') + '</select></td>' +
                        '<td></td><td></td>' +
                        '<td style="padding:8px 10px;"><div class="mc-toggle' + (sub.active !== false ? ' on' : '') + '" onclick="this.classList.toggle(\'on\')"><div></div></div></td>' +
                        '<td></td>' +
                    '</tr>';
                }).join('');
                var addSubRow = '<tr class="stg-lstage-sub-' + i + '" style="display:none;background:#FAFBFC;"><td colspan="6" style="padding:6px 10px 12px 34px;"><a href="javascript:void(0)" onclick="stgAddLeadSubstage(this,' + i + ')" style="font-size:12.5px;color:#2979d4;text-decoration:none;">+ Add New Sub Stage</a></td></tr>';
                return stageRow + subRows + addSubRow;
            }).join('');

            var panel = document.createElement('div');
            panel.className = 'stg-row-card stg-row-configure-panel';
            panel.innerHTML =
                '<div style="width:100%;overflow-x:auto;">' +
                    '<table style="width:100%;border-collapse:collapse;font-size:13px;">' +
                        '<thead><tr style="background:#F9FAFB;color:#6B7280;font-size:12px;">' +
                            '<th style="text-align:left;padding:8px 10px;">Stage</th>' +
                            '<th style="text-align:left;padding:8px 10px;">Follow up Required</th>' +
                            '<th style="text-align:left;padding:8px 10px;">Sub Stage Required</th>' +
                            '<th style="text-align:left;padding:8px 10px;">Select Score</th>' +
                            '<th style="text-align:left;padding:8px 10px;">Active</th>' +
                            '<th></th>' +
                        '</tr></thead>' +
                        '<tbody id="stgLeadStageBody">' + bodyHtml + '</tbody>' +
                    '</table>' +
                    '<div style="margin-top:10px;"><a href="javascript:void(0)" onclick="stgAddLeadStage()" style="font-size:12.5px;color:#2979d4;text-decoration:none;">+ Add New Stage</a></div>' +
                    '<div style="display:flex;justify-content:flex-end;margin-top:14px;">' +
                        '<button class="stg-row-card-btn" style="border-color:#2979d4;color:#2979d4;" onclick="stgSaveLeadStages(this)">Save</button>' +
                    '</div>' +
                '</div>';
            card.insertAdjacentElement('afterend', panel);
        }

        // Walks the rendered stage table and reconstructs a plain-data snapshot
        // (stage name/follow-up/sub-stage-required/score/active + each substage's
        // name/follow-up/active), so a Save can be persisted and later restored exactly.
        function stgSerializeLeadStages(panel) {
            var tbody = panel.querySelector('#stgLeadStageBody');
            if (!tbody) return [];
            var stages = [];
            var current = null;
            Array.prototype.forEach.call(tbody.children, function (tr) {
                var isSubRow = /(^|\s)stg-lstage-sub-\d+(\s|$)/.test(tr.className);
                var nameEl = tr.querySelector('.stg-lstage-name-text');
                if (!isSubRow) {
                    var selects = tr.querySelectorAll('select');
                    var toggle = tr.querySelector('.mc-toggle');
                    current = {
                        name: nameEl ? nameEl.textContent.trim() : 'Stage',
                        followUp: selects[0] ? selects[0].value : 'No',
                        subStageRequired: selects[1] ? selects[1].value : 'No',
                        score: selects[2] ? parseInt(selects[2].value, 10) : 0,
                        active: toggle ? toggle.classList.contains('on') : true,
                        subs: []
                    };
                    stages.push(current);
                } else if (nameEl && current) {
                    var subSelect = tr.querySelector('select');
                    var subToggle = tr.querySelector('.mc-toggle');
                    current.subs.push({
                        name: nameEl.textContent.trim(),
                        followUp: subSelect ? subSelect.value : 'No',
                        active: subToggle ? subToggle.classList.contains('on') : true
                    });
                }
            });
            return stages;
        }

        function stgSaveLeadStages(btn) {
            var panel = btn.closest('.stg-row-configure-panel');
            if (!panel) return;
            var card = panel.previousElementSibling;
            var stages = stgSerializeLeadStages(panel);
            if (card) {
                var statusEl = card.querySelector('[class^="stg-status-"]');
                if (statusEl) { statusEl.className = 'stg-status-configured'; statusEl.textContent = 'Configured'; }
                stgSaveSetting(stgRowKey(card), { stages: stages, status: 'Configured' });
            }
            panel.remove();
        }

        function stgLeadConditionRowHtml(saved) {
            saved = saved || {};
            var selectedStages = saved.stages || [];
            var thenVal = saved.then || 'Select options';
            var performedBy = saved.performedBy || '';
            var stageOptions = LEAD_STAGES.map(function (s) {
                return '<option' + (selectedStages.indexOf(s.name) !== -1 ? ' selected' : '') + '>' + s.name + '</option>';
            }).join('');
            var thenOpts = ['Select options', 'Stage cannot be changed', 'Stage can only be changed', 'Stage cannot be marked down', 'Follow up cannot be changed']
                .map(function (o) { return '<option' + (o === thenVal ? ' selected' : '') + '>' + o + '</option>'; }).join('');
            return '<div style="display:flex;gap:20px;margin-bottom:14px;flex-wrap:wrap;">' +
                '<div style="flex:1;min-width:160px;"><div class="stg-row-card-text"><div class="stg-row-card-name" style="font-weight:400;font-size:12.5px;color:#6B7280;">If Lead Stage is</div></div><select class="stg-lcond-stages" multiple style="width:100%;margin-top:4px;padding:6px 8px;border:1px solid #E2E8F0;border-radius:6px;font-size:13px;height:70px;">' + stageOptions + '</select></div>' +
                '<div style="flex:1;min-width:200px;"><div class="stg-row-card-text"><div class="stg-row-card-name" style="font-weight:400;font-size:12.5px;color:#6B7280;">Then</div></div><select class="stg-lcond-then" style="width:100%;margin-top:4px;padding:8px 10px;border:1px solid #E2E8F0;border-radius:6px;font-size:13px;">' + thenOpts + '</select></div>' +
                '<div style="flex:1;min-width:160px;"><div class="stg-row-card-text"><div class="stg-row-card-name" style="font-weight:400;font-size:12.5px;color:#6B7280;">Performed By</div></div><input type="text" class="stg-lcond-performedby" value="' + performedBy + '" placeholder="Nothing selected" style="width:100%;margin-top:4px;padding:8px 10px;border:1px solid #E2E8F0;border-radius:6px;font-size:13px;"></div>' +
            '</div>';
        }

        function stgAddLeadCondition() {
            var list = document.getElementById('stgLeadConditionsList');
            if (!list) return;
            var div = document.createElement('div');
            div.innerHTML = stgLeadConditionRowHtml();
            list.appendChild(div.firstChild);
        }

        // Bespoke inline-expand panel for CRM > Lead Stage > "Conditional Logics on Lead stage"
        // — matches the real product's If/Then/Performed-By rule builder.
        function stgConfigureLeadStageConditions(btn) {
            var card = btn.closest('.stg-row-card');
            if (!card) return;
            var next = card.nextElementSibling;
            if (next && next.classList.contains('stg-row-configure-panel')) { next.remove(); return; }
            var rows = card.parentElement;
            if (rows) { var openPanel = rows.querySelector('.stg-row-configure-panel'); if (openPanel) openPanel.remove(); }
            var saved = STG_SETTINGS_CACHE[stgRowKey(card)];
            var conditions = (saved && saved.conditions && saved.conditions.length) ? saved.conditions : [{}];
            var listHtml = conditions.map(function (c) { return stgLeadConditionRowHtml(c); }).join('');
            var panel = document.createElement('div');
            panel.className = 'stg-row-card stg-row-configure-panel';
            panel.innerHTML =
                '<div style="width:100%;">' +
                    '<div id="stgLeadConditionsList">' + listHtml + '</div>' +
                    '<div style="margin-top:4px;"><a href="javascript:void(0)" onclick="stgAddLeadCondition()" style="font-size:12.5px;color:#2979d4;text-decoration:none;">+ Add More Condition</a></div>' +
                    '<div style="display:flex;justify-content:flex-end;margin-top:14px;">' +
                        '<button class="stg-row-card-btn" style="border-color:#2979d4;color:#2979d4;" onclick="stgSaveLeadStageConditions(this)">Save</button>' +
                    '</div>' +
                '</div>';
            card.insertAdjacentElement('afterend', panel);
        }

        function stgSaveLeadStageConditions(btn) {
            var panel = btn.closest('.stg-row-configure-panel');
            if (!panel) return;
            var card = panel.previousElementSibling;
            var rowsEls = panel.querySelectorAll('#stgLeadConditionsList > div');
            var conditions = Array.prototype.map.call(rowsEls, function (row) {
                var stageSel = row.querySelector('.stg-lcond-stages');
                var thenSel = row.querySelector('.stg-lcond-then');
                var perfInp = row.querySelector('.stg-lcond-performedby');
                var stages = stageSel ? Array.prototype.map.call(stageSel.selectedOptions, function (o) { return o.value; }) : [];
                return { stages: stages, then: thenSel ? thenSel.value : 'Select options', performedBy: perfInp ? perfInp.value : '' };
            });
            var anySet = conditions.some(function (c) { return c.stages.length || (c.then && c.then !== 'Select options') || c.performedBy; });
            if (card) {
                var statusEl = card.querySelector('[class^="stg-status-"]');
                if (statusEl) {
                    statusEl.className = anySet ? 'stg-status-configured' : 'stg-status-inactive';
                    statusEl.textContent = anySet ? 'Configured' : 'Not Set';
                }
                stgSaveSetting(stgRowKey(card), { conditions: conditions, status: anySet ? 'Configured' : 'Not Set' });
            }
            panel.remove();
        }

        const sparklineConfig = {
            type: 'line',
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { display: false }, y: { display: false } },
                elements: { point: { radius: 0 } }
            }
        };

        new Chart(document.getElementById('sparkline1'), {
            ...sparklineConfig,
            data: {
                labels: ['', '', '', '', '', ''],
                datasets: [{
                    data: [100, 140, 120, 180, 160, 200],
                    borderColor: '#4f8ef7',
                    backgroundColor: 'rgba(79, 142, 247, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            }
        });

        new Chart(document.getElementById('sparkline2'), {
            ...sparklineConfig,
            data: {
                labels: ['', '', '', '', '', ''],
                datasets: [{
                    data: [80, 100, 90, 130, 110, 150],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            }
        });

        new Chart(document.getElementById('sparkline3'), {
            ...sparklineConfig,
            data: {
                labels: ['', '', '', '', '', ''],
                datasets: [{
                    data: [50, 70, 65, 60, 55, 50],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            }
        });

        new Chart(document.getElementById('sparkline4'), {
            ...sparklineConfig,
            data: {
                labels: ['', '', '', '', '', ''],
                datasets: [{
                    data: [150, 180, 200, 250, 280, 320],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            }
        });

        new Chart(document.getElementById('funnelChart'), {
            type: 'bar',
            data: {
                labels: ['Leads', 'Prospects', 'Qualified', 'Applications', 'Enrolled'],
                datasets: [{
                    label: 'Count',
                    data: [3847, 2100, 1204, 700, 489],
                    backgroundColor: '#4f8ef7'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                indexAxis: 'y',
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { beginAtZero: true }
                }
            }
        });

        new Chart(document.getElementById('doughnutChart'), {
            type: 'doughnut',
            data: {
                labels: ['Google Ads', 'WhatsApp', 'Facebook', 'Organic', 'Referral', 'Others'],
                datasets: [{
                    data: [34, 22, 18, 14, 8, 4],
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });

        // ── Recent Search ──────────────────────────────────────────
        (function() {
            var MAX_RECENT = 6;

            // ── Settings index ──────────────────────────────────────
            var SETTINGS_INDEX = [
                { label: 'Organisation Profile',  category: 'Onboarding',            icon: '🏛️', action: function(){ openOrgProfile(null); } },
                { label: 'Manage Accounts',        category: 'Onboarding',            icon: '👥', action: function(){ openManageAccounts(); } },
                { label: 'Rename Tags',            category: 'Account Setup',         icon: '🏷️', action: function(){ openRenameTagsView(); } },
                { label: 'User Default Page',      category: 'Account Setup',         icon: '⚙️', action: function(){ openUserDefaultPage(); } },
                { label: 'Custom Fields',          category: 'Account Setup',         icon: '⚙️', action: function(){ openSection('sec-accsettings-extra','acc-accsettings'); } },
                { label: 'Display Preferences',    category: 'Account Setup',         icon: '⚙️', action: function(){ openSection('sec-accsettings-extra','acc-accsettings'); } },
                { label: 'Notification Settings',  category: 'Account Setup',         icon: '🔔', action: function(){ openSection('sec-accsettings-extra','acc-accsettings'); } },
                { label: 'Lead Verification Settings', category: 'CRM',               icon: '✅', action: function(){ openSection('sec-crm-leadflow','acc-crm'); } },
                { label: 'Mobile Number validations',  category: 'CRM',               icon: '📱', action: function(){ openSection('sec-crm-leadflow','acc-crm'); } },
                { label: 'Registration Attempt configurations', category: 'CRM',      icon: '📝', action: function(){ openSection('sec-crm-leadflow','acc-crm'); } },
                { label: 'Lead Stage',             category: 'CRM',                   icon: '🎯', action: function(){ openSection('sec-crm-leadstage','acc-crm'); } },
                { label: 'Conversion Funnel',      category: 'CRM',                   icon: '📊', action: function(){ openSection('sec-crm-funnel','acc-crm'); } },
                { label: 'Campaign Settings',      category: 'CRM',                   icon: '📣', action: function(){ openSection('sec-crm-campaign','acc-crm'); } },
                { label: 'Lead Score',             category: 'CRM',                   icon: '📊', action: function(){ openSection('sec-crm-score','acc-crm'); } },
                { label: 'Lead Allocation',        category: 'CRM',                   icon: '🎯', action: function(){ openSection('sec-crm-allocation','acc-crm'); } },
                { label: 'Agent',                  category: 'CRM',                   icon: '👤', action: function(){ openSection('sec-crm-agent','acc-crm'); } },
                { label: 'Custom Flow',            category: 'CRM',                   icon: '🔀', action: function(){ openSection('sec-crm-customflow','acc-crm'); } },
                { label: 'User Management',        category: 'Users & Teams',         icon: '👤', action: function(){ openSection('sec-users','acc-users'); } },
                { label: 'Role Hierarchy',         category: 'Users & Teams',         icon: '👥', action: function(){ openSection('sec-users','acc-users'); } },
                { label: 'Permission Groups',      category: 'Users & Teams',         icon: '🔑', action: function(){ openSection('sec-users','acc-users'); } },
                { label: 'Teams',                  category: 'Users & Teams',         icon: '👥', action: function(){ openSection('sec-users','acc-users'); } },
                { label: 'Login Methods',          category: 'Security & Compliance', icon: '🔐', action: function(){ openSection('sec-security','acc-security'); } },
                { label: 'SSO/SAML',               category: 'Security & Compliance', icon: '🔐', action: function(){ openSection('sec-security','acc-security'); } },
                { label: 'TOTP Authenticator',     category: 'Security & Compliance', icon: '🔐', action: function(){ openSection('sec-security','acc-security'); } },
                { label: 'IP Allowlist',           category: 'Security & Compliance', icon: '🛡️', action: function(){ openSection('sec-security','acc-security'); } },
                { label: 'PII Masking',            category: 'Security & Compliance', icon: '🛡️', action: function(){ openSection('sec-security','acc-security'); } },
                { label: 'Audit Trail',            category: 'Security & Compliance', icon: '📋', action: function(){ openSection('sec-security','acc-security'); } },
                { label: 'WhatsApp National',      category: 'Communication',         icon: '💬', action: function(){ openSection('sec-comms','acc-comms'); } },
                { label: 'WhatsApp International', category: 'Communication',         icon: '💬', action: function(){ openSection('sec-comms','acc-comms'); } },
                { label: 'SMS/OTP',                category: 'Communication',         icon: '📱', action: function(){ openSection('sec-comms','acc-comms'); } },
                { label: 'Email Provider',         category: 'Communication',         icon: '📧', action: function(){ openSection('sec-comms','acc-comms'); } },
                { label: 'Telephony/IVR',          category: 'Communication',         icon: '📞', action: function(){ openSection('sec-comms','acc-comms'); } },
                { label: 'Template Library',       category: 'Communication',         icon: '📄', action: function(){ openSection('sec-comms','acc-comms'); } },
                { label: 'Lead Stages',            category: 'Leads & Enrollment',    icon: '🎯', action: function(){ openSection('sec-leads','acc-leads'); } },
                { label: 'Lead Allocation',        category: 'Leads & Enrollment',    icon: '🎯', action: function(){ openSection('sec-leads','acc-leads'); } },
                { label: 'Lead Score Rules',       category: 'Leads & Enrollment',    icon: '📊', action: function(){ openSection('sec-leads','acc-leads'); } },
                { label: 'Registration Config',    category: 'Leads & Enrollment',    icon: '📝', action: function(){ openSection('sec-leads','acc-leads'); } },
                { label: 'Campaign Config',        category: 'Marketing',             icon: '📣', action: function(){ openSection('sec-marketing','acc-marketing'); } },
                { label: 'Landing Pages',          category: 'Marketing',             icon: '🌐', action: function(){ openSection('sec-marketing','acc-marketing'); } },
                { label: 'Google Ads',             category: 'Marketing',             icon: '📣', action: function(){ openSection('sec-marketing','acc-marketing'); } },
                { label: 'Meta/Facebook',          category: 'Marketing',             icon: '📣', action: function(){ openSection('sec-marketing','acc-marketing'); } },
                { label: 'Referral Connect',       category: 'Marketing',             icon: '🔗', action: function(){ openSection('sec-marketing','acc-marketing'); } },
                { label: 'Connectors',             category: 'Integrations',          icon: '🔌', action: function(){ openSection('sec-integrations','acc-integrations'); } },
                { label: 'Webhooks',               category: 'Integrations',          icon: '🔌', action: function(){ openSection('sec-integrations','acc-integrations'); } },
                { label: 'API Tokens',             category: 'Integrations',          icon: '🔑', action: function(){ openSection('sec-integrations','acc-integrations'); } },
                { label: 'ERP Push',               category: 'Integrations',          icon: '🔌', action: function(){ openSection('sec-integrations','acc-integrations'); } },
                { label: 'Fee Types',              category: 'Finance',               icon: '💳', action: function(){ openSection('sec-finance','acc-finance'); } },
                { label: 'Payment Gateways',       category: 'Finance',               icon: '💳', action: function(){ openSection('sec-finance','acc-finance'); } },
                { label: 'Discount Coupons',       category: 'Finance',               icon: '🏷️', action: function(){ openSection('sec-finance','acc-finance'); } },
                { label: 'Wallet & Ledger',        category: 'Finance',               icon: '💰', action: function(){ openSection('sec-finance','acc-finance'); } },
                { label: 'Master Data/Taxonomy',   category: 'Data Administration',   icon: '🗂️', action: function(){ openSection('sec-data','acc-data'); } },
                { label: 'Tag Library',            category: 'Data Administration',   icon: '🏷️', action: function(){ openSection('sec-data','acc-data'); } },
                { label: 'Custom Activities',      category: 'Data Administration',   icon: '🗂️', action: function(){ openSection('sec-data','acc-data'); } },
                { label: 'Dynamic Reports',        category: 'Data Administration',   icon: '📊', action: function(){ openSection('sec-data','acc-data'); } },
                { label: 'Archival Rules',         category: 'Data Administration',   icon: '🗃️', action: function(){ openSection('sec-data','acc-data'); } },
            ];

            var input    = document.getElementById('stgSearchInput');
            var dropdown = document.getElementById('stgSearchDropdown');
            var list     = document.getElementById('stgRecentList');
            var clearBtn = document.getElementById('stgClearRecent');
            var wrap     = document.getElementById('stgSearchWrap');
            var ddHeader = document.querySelector('.stg-search-dd-header');

            var recentSearches = [];

            function escHtml(str) {
                return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
            }

            function highlight(text, query) {
                if (!query) return escHtml(text);
                var re = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ')', 'gi');
                return escHtml(text).replace(re, '<mark style="background:#fef9c3;color:#92400e;border-radius:2px;padding:0 1px;">$1</mark>');
            }

            function positionDropdown() {
                var rect = wrap.getBoundingClientRect();
                dropdown.style.top   = (rect.bottom + 6) + 'px';
                dropdown.style.left  = rect.left + 'px';
                dropdown.style.width = rect.width + 'px';
            }

            // ── Render recent searches ──────────────────────────────
            function renderRecent() {
                ddHeader.style.display = '';
                list.innerHTML = '';
                if (recentSearches.length === 0) {
                    list.innerHTML = '<div class="stg-search-dd-empty">No recent searches yet — try searching above</div>';
                    clearBtn.style.display = 'none';
                    return;
                }
                clearBtn.style.display = '';
                recentSearches.forEach(function(term, idx) {
                    var item = document.createElement('div');
                    item.className = 'stg-search-dd-item';
                    item.innerHTML =
                        '<div class="stg-search-dd-icon">🕐</div>' +
                        '<span class="stg-search-dd-text">' + escHtml(term) + '</span>' +
                        '<button class="stg-search-dd-remove" title="Remove">✕</button>';
                    item.querySelector('.stg-search-dd-text').addEventListener('mousedown', function(e) {
                        e.preventDefault();
                        input.value = term;
                        renderResults(term);
                    });
                    item.querySelector('.stg-search-dd-remove').addEventListener('mousedown', function(e) {
                        e.preventDefault(); e.stopPropagation();
                        recentSearches.splice(idx, 1);
                        renderRecent();
                    });
                    list.appendChild(item);
                });
            }

            // ── Render search results ───────────────────────────────
            function renderResults(query) {
                ddHeader.style.display = 'none';
                list.innerHTML = '';
                var q = query.trim().toLowerCase();
                if (!q) { ddHeader.style.display = ''; renderRecent(); return; }

                var matches = SETTINGS_INDEX.filter(function(s) {
                    return s.label.toLowerCase().indexOf(q) !== -1 ||
                           s.category.toLowerCase().indexOf(q) !== -1;
                });

                if (matches.length === 0) {
                    list.innerHTML = '<div class="stg-search-dd-empty">No results for "<strong>' + escHtml(query) + '</strong>"</div>';
                    return;
                }

                matches.forEach(function(s) {
                    var item = document.createElement('div');
                    item.className = 'stg-search-dd-item';
                    item.style.cursor = s.action ? 'pointer' : 'default';
                    item.innerHTML =
                        '<div class="stg-search-dd-icon">' + s.icon + '</div>' +
                        '<div style="flex:1;min-width:0;">' +
                            '<div class="stg-search-dd-text">' + highlight(s.label, query) + '</div>' +
                            '<div style="font-size:11px;color:#9ca3af;margin-top:1px;">' + escHtml(s.category) + '</div>' +
                        '</div>' +
                        (s.action ? '<span style="font-size:11px;color:#c5cad4;">↗</span>' : '');
                    if (s.action) {
                        item.addEventListener('mousedown', function(e) {
                            e.preventDefault();
                            addRecent(query.trim());
                            input.value = '';
                            closeDropdown();
                            s.action();
                        });
                    }
                    list.appendChild(item);
                });
            }

            function addRecent(term) {
                if (!term) return;
                recentSearches = recentSearches.filter(function(t) { return t !== term; });
                recentSearches.unshift(term);
                if (recentSearches.length > MAX_RECENT) recentSearches = recentSearches.slice(0, MAX_RECENT);
            }

            function openDropdown() {
                positionDropdown();
                var q = input.value.trim();
                if (q) renderResults(q); else { ddHeader.style.display = ''; renderRecent(); }
                dropdown.classList.add('visible');
            }

            function closeDropdown() {
                dropdown.classList.remove('visible');
            }

            // ── Events ─────────────────────────────────────────────
            input.addEventListener('focus', openDropdown);
            input.addEventListener('click', openDropdown);

            input.addEventListener('input', function() {
                positionDropdown();
                renderResults(input.value);
                dropdown.classList.add('visible');
            });

            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && input.value.trim()) {
                    addRecent(input.value.trim());
                    input.value = '';
                    ddHeader.style.display = '';
                    renderRecent();
                }
                if (e.key === 'Escape') { closeDropdown(); input.blur(); }
            });

            clearBtn.addEventListener('mousedown', function(e) {
                e.preventDefault();
                recentSearches = [];
                renderRecent();
            });

            document.addEventListener('mousedown', function(e) {
                if (!wrap.contains(e.target) && !dropdown.contains(e.target)) closeDropdown();
            });

            // ⌘K / Ctrl+K
            document.addEventListener('keydown', function(e) {
                if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                    var sv = document.getElementById('settings-view');
                    if (sv && sv.classList.contains('open')) {
                        e.preventDefault(); input.focus(); openDropdown();
                    }
                }
            });
        })();

        // ── Profile dropdown ───────────────────────────────────────
        function toggleProfileMenu() {
            document.getElementById('profileDropdown').classList.toggle('open');
        }
        function closeProfileMenu() {
            document.getElementById('profileDropdown').classList.remove('open');
        }
        document.addEventListener('mousedown', function(e) {
            var profileWrap = document.getElementById('profileWrap');
            if (profileWrap && !profileWrap.contains(e.target)) closeProfileMenu();
        });

        // ── User Default Page ──────────────────────────────────────
        var UDP_SYSTEM_PRIORITY = [
            'Admin Dashboard','Lead Management','Application Manager',
            'Manage Leads','Opportunity List','Campaign Dashboard',
            'Reports and Analytics','Purchase Summary','User Dashboard'
        ];

        // Which pages each permission set can access
        var UDP_ACCESS = {
            'Admin':       ['Admin Dashboard','Lead Management','Application Manager','Manage Leads','Opportunity List','Campaign Dashboard','Reports and Analytics','Purchase Summary','User Dashboard'],
            'Super Admin': ['Admin Dashboard','Lead Management','Application Manager','Manage Leads','Opportunity List','Campaign Dashboard','Reports and Analytics','Purchase Summary','User Dashboard'],
            'Manager':     ['Lead Management','Application Manager','Manage Leads','Opportunity List','Reports and Analytics','Campaign Dashboard'],
            'Counsellor':  ['Lead Management','Manage Leads','Opportunity List','User Dashboard'],
            'Viewer':      ['Lead Management','Opportunity List'],
            'Read Only':   ['Lead Management','Opportunity List','Reports and Analytics']
        };
        var UDP_ALL_PERMS = Object.keys(UDP_ACCESS);

        // Permission set overrides: null page = no override (use system default)
        var UDP_OVERRIDES = [
            { perm: 'Admin',   page: 'Admin Dashboard' },
            { perm: 'Manager', page: 'Lead Management' }
        ];

        var udpSysDragSrc = null;

        // Compute effective page + status for a given override row
        function udpEffective(permSet, overridePage) {
            var access = UDP_ACCESS[permSet] || [];
            if (overridePage && access.indexOf(overridePage) !== -1) {
                return { page: overridePage, status: 'custom' };
            }
            // walk system priority for first accessible page
            for (var i = 0; i < UDP_SYSTEM_PRIORITY.length; i++) {
                if (access.indexOf(UDP_SYSTEM_PRIORITY[i]) !== -1) {
                    return {
                        page: UDP_SYSTEM_PRIORITY[i],
                        status: overridePage ? 'no-access' : 'system'
                    };
                }
            }
            return { page: '—', status: 'system' };
        }

        // ── Zone A: System Default Priority ────────────────────────
        var UDP_ALL_PAGES = ['Admin Dashboard','Lead Management','Application Manager','Manage Leads','Opportunity List','Campaign Dashboard','Reports and Analytics','Purchase Summary','User Dashboard'];

        function udpRenderSys() {
            var container = document.getElementById('udpSysContainer');
            if (!container) return;
            container.innerHTML = '';

            // Rows
            var list = document.createElement('div');
            list.id = 'udpSysList';
            UDP_SYSTEM_PRIORITY.forEach(function(page, idx) {
                var row = document.createElement('div');
                row.className = 'udp-sys-row';
                row.draggable = true;
                row.dataset.idx = idx;
                row.innerHTML =
                    '<div class="udp-drag-handle">' +
                        '<div class="udp-drag-dot"></div><div class="udp-drag-dot"></div>' +
                        '<div class="udp-drag-dot"></div><div class="udp-drag-dot"></div>' +
                        '<div class="udp-drag-dot"></div><div class="udp-drag-dot"></div>' +
                    '</div>' +
                    '<div class="udp-sys-num">' + (idx + 1) + '</div>' +
                    '<div class="udp-sys-name">' + page + '</div>' +
                    '<button class="udp-del-btn" style="margin:0 auto" onclick="udpRemoveSysPage(' + idx + ')" title="Remove">&#8722;</button>';

                row.addEventListener('dragstart', function(e) {
                    udpSysDragSrc = idx;
                    row.classList.add('dragging');
                    e.dataTransfer.effectAllowed = 'move';
                });
                row.addEventListener('dragend', function() {
                    row.classList.remove('dragging');
                    container.querySelectorAll('.udp-sys-row').forEach(function(r){ r.classList.remove('drag-over'); });
                });
                row.addEventListener('dragover', function(e) {
                    e.preventDefault();
                    container.querySelectorAll('.udp-sys-row').forEach(function(r){ r.classList.remove('drag-over'); });
                    row.classList.add('drag-over');
                });
                row.addEventListener('drop', function(e) {
                    e.preventDefault();
                    var target = parseInt(row.dataset.idx);
                    if (udpSysDragSrc === null || udpSysDragSrc === target) return;
                    var moved = UDP_SYSTEM_PRIORITY.splice(udpSysDragSrc, 1)[0];
                    UDP_SYSTEM_PRIORITY.splice(target, 0, moved);
                    udpSysDragSrc = null;
                    udpRenderSys();
                    udpRenderOverrides();
                });
                list.appendChild(row);
            });
            container.appendChild(list);

            // Add page row
            var available = UDP_ALL_PAGES.filter(function(p){ return UDP_SYSTEM_PRIORITY.indexOf(p) === -1; });
            var addWrap = document.createElement('div');
            addWrap.className = 'udp-add-ov-wrap';
            if (available.length > 0) {
                addWrap.innerHTML =
                    '<div style="display:flex;align-items:center;gap:10px">' +
                        '<button class="udp-add-ov-btn" onclick="udpShowSysAdd()">' +
                            '<span style="width:18px;height:18px;border-radius:50%;border:1.5px solid #4f8ef7;display:inline-flex;align-items:center;justify-content:center;font-size:14px;line-height:1">+</span>' +
                            ' Add page' +
                        '</button>' +
                        '<div id="udpSysAddWrap" style="display:none;flex:1;max-width:260px;position:relative">' +
                            '<select id="udpSysAddSelect" class="udp-ov-select" style="width:100%">' +
                                '<option value="" disabled selected>Select page to add</option>' +
                                available.map(function(p){ return '<option value="' + p + '">' + p + '</option>'; }).join('') +
                            '</select>' +
                            '<div style="position:absolute;right:10px;top:50%;transform:translateY(-50%);pointer-events:none;border-left:4px solid transparent;border-right:4px solid transparent;border-top:5px solid #9ca3af"></div>' +
                        '</div>' +
                        '<button id="udpSysAddConfirm" style="display:none;height:34px;padding:0 16px;border-radius:7px;border:none;background:#4f8ef7;color:#fff;font-size:13px;font-weight:600;cursor:pointer" onclick="udpConfirmSysAdd()">Add</button>' +
                    '</div>';
            } else {
                addWrap.innerHTML = '<span style="font-size:12px;color:#9ca3af">All pages are already in the priority list.</span>';
            }
            container.appendChild(addWrap);
        }

        function udpShowSysAdd() {
            var wrap = document.getElementById('udpSysAddWrap');
            var btn  = document.getElementById('udpSysAddConfirm');
            if (wrap) wrap.style.display = 'block';
            if (btn)  btn.style.display  = 'inline-block';
            if (wrap) wrap.querySelector('select').focus();
        }

        function udpConfirmSysAdd() {
            var sel = document.getElementById('udpSysAddSelect');
            if (!sel || !sel.value) return;
            UDP_SYSTEM_PRIORITY.push(sel.value);
            udpRenderSys();
            udpRenderOverrides();
        }

        function udpRemoveSysPage(idx) {
            if (UDP_SYSTEM_PRIORITY.length <= 1) return;
            UDP_SYSTEM_PRIORITY.splice(idx, 1);
            udpRenderSys();
            udpRenderOverrides();
        }

        // ── Zone B: Permission Set Overrides ───────────────────────
        function udpRenderOverrides() {
            var list = document.getElementById('udpOverrideList');
            if (!list) return;
            list.innerHTML = '';

            UDP_OVERRIDES.forEach(function(ov, idx) {
                var eff        = udpEffective(ov.perm, ov.page);
                var warnClass  = eff.status === 'no-access' ? ' warn' : '';
                var effClass   = eff.status === 'no-access' ? ' no-access' : '';
                var usedPerms  = UDP_OVERRIDES.map(function(o, i){ return i !== idx ? o.perm : null; }).filter(Boolean);

                // Permission set dropdown options
                var permOptions = [''].concat(UDP_ALL_PERMS).map(function(p) {
                    var sel      = p === ov.perm ? ' selected' : '';
                    var disabled = !p ? ' disabled' : '';
                    var label    = p || '— Select permission set —';
                    var grayed   = usedPerms.indexOf(p) !== -1 ? ' style="color:#d1d5db"' : '';
                    return '<option value="' + p + '"' + sel + disabled + grayed + '>' + label + '</option>';
                }).join('');

                // Override page dropdown options (filtered by perm access)
                var accessiblePages = ov.perm ? (UDP_ACCESS[ov.perm] || []) : [];
                var pageOptions = ([''].concat(UDP_SYSTEM_PRIORITY)).map(function(p) {
                    if (!p) return '<option value="" disabled' + (!ov.page ? ' selected' : '') + '>Select default page</option>';
                    var sel      = ov.page === p ? ' selected' : '';
                    var noAccess = accessiblePages.length && accessiblePages.indexOf(p) === -1;
                    var grayed   = noAccess ? ' style="color:#d1d5db"' : '';
                    var suffix   = noAccess ? ' (no access)' : '';
                    return '<option value="' + p + '"' + sel + grayed + '>' + p + suffix + '</option>';
                }).join('');

                var row = document.createElement('div');
                row.className = 'udp-ov-row';
                row.innerHTML =
                    // Col 1: Permission set dropdown
                    '<div class="udp-ov-select-wrap">' +
                        '<select class="udp-ov-select" onchange="udpSetPerm(' + idx + ',this.value)">' +
                            permOptions +
                        '</select>' +
                    '</div>' +
                    // Col 2: Default page dropdown
                    '<div class="udp-ov-select-wrap">' +
                        '<select class="udp-ov-select' + warnClass + '" ' + (!ov.perm ? 'disabled style="opacity:.5"' : '') + ' onchange="udpSetPage(' + idx + ',this.value)">' +
                            pageOptions +
                        '</select>' +
                    '</div>' +
                    // Col 3: Delete
                    '<button class="udp-del-btn" onclick="udpDeleteOverride(' + idx + ')" title="Remove row">&#8722;</button>';

                list.appendChild(row);

                // Inline warning row for no-access
                if (eff.status === 'no-access') {
                    var warn = document.createElement('div');
                    warn.style.cssText = 'padding:0 16px 8px;font-size:11px;color:#d97706;display:flex;align-items:center;gap:5px;margin-top:-6px';
                    warn.innerHTML = '<span>⚠</span> This role has no access to the selected page — system default will be used instead.';
                    list.appendChild(warn);
                }
            });
        }

        function udpSetPerm(idx, val) {
            UDP_OVERRIDES[idx].perm = val;
            UDP_OVERRIDES[idx].page = null; // reset page when perm changes
            udpRenderOverrides();
        }

        function udpSetPage(idx, val) {
            UDP_OVERRIDES[idx].page = val || null;
            udpRenderOverrides();
        }

        function udpDeleteOverride(idx) {
            UDP_OVERRIDES.splice(idx, 1);
            udpRenderOverrides();
        }

        function udpAddOverride() {
            UDP_OVERRIDES.push({ perm: '', page: null });
            udpRenderOverrides();
            // Focus the new perm dropdown
            var rows = document.querySelectorAll('#udpOverrideList .udp-ov-row');
            if (rows.length) rows[rows.length - 1].querySelector('select').focus();
        }

        function udpSave() {
            var status = document.getElementById('udpSaveStatus');
            if (status) { status.textContent = '✓ Saved'; setTimeout(function(){ status.textContent = ''; }, 2500); }
        }

        var _origOpenUdp = window.openUserDefaultPage;
        window.openUserDefaultPage = function() {
            _origOpenUdp();
            setTimeout(function(){
                udpRenderSys();
                udpRenderOverrides();
            }, 0);
            trackVisit('User Default Page', function(){ openUserDefaultPage(); });
        };

        // ── Recent Visits ──────────────────────────────────────────
        (function() {
            var MAX_VISITS = 5;
            var recentVisits = [];   // [{ label, action }]
            var currentLabel = null;

            var bar   = document.getElementById('stgRecentBar');
            var pills = document.getElementById('stgRecentPills');

            function renderPills() {
                pills.innerHTML = '';
                if (recentVisits.length === 0) { bar.classList.remove('visible'); return; }
                bar.classList.add('visible');
                recentVisits.forEach(function(v) {
                    var pill = document.createElement('span');
                    pill.className = 'stg-recent-pill' + (v.label === currentLabel ? ' active-pill' : '');
                    pill.textContent = v.label;
                    pill.addEventListener('click', function() { v.action(); });
                    pills.appendChild(pill);
                });
            }

            // Public: call this from every navigation action
            window.trackVisit = function(label, actionFn) {
                currentLabel = label;
                // Remove duplicate
                recentVisits = recentVisits.filter(function(v) { return v.label !== label; });
                recentVisits.unshift({ label: label, action: actionFn });
                if (recentVisits.length > MAX_VISITS) recentVisits = recentVisits.slice(0, MAX_VISITS);
                renderPills();
            };

            // Hide bar when back to settings home
            var origCancel = window.cancelToSettings;
            window.cancelToSettings = function() {
                origCancel();
                currentLabel = null;
                renderPills();
            };
        })();

        // Patch navigation functions to track visits
        (function() {
            var _orig_openOrgProfile = window.openOrgProfile;
            window.openOrgProfile = function(el) {
                _orig_openOrgProfile(el);
                trackVisit('Organisation Profile', function(){ openOrgProfile(null); });
            };

            var _orig_openManageAccounts = window.openManageAccounts;
            window.openManageAccounts = function() {
                _orig_openManageAccounts();
                trackVisit('Manage Accounts', function(){ openManageAccounts(); });
            };

            var _orig_openRenameTagsView = window.openRenameTagsView;
            window.openRenameTagsView = function() {
                _orig_openRenameTagsView();
                trackVisit('Rename Tags', function(){ openRenameTagsView(); });
            };

            var _orig_openUserDefaultPage = window.openUserDefaultPage;
            window.openUserDefaultPage = function() {
                _orig_openUserDefaultPage();
            };

            var _orig_openSection = window.openSection;
            window.openSection = function(sectionId, accordionId) {
                _orig_openSection(sectionId, accordionId);
                var labelMap = {
                    'sec-mets':         'METS',
                    'sec-accsettings-extra': 'Account Setup',
                    'sec-crm-leadflow': 'Lead Flow',
                    'sec-crm-leadstage': 'Lead Stage',
                    'sec-crm-funnel': 'Conversion Funnel',
                    'sec-crm-campaign': 'Campaign Settings',
                    'sec-crm-score': 'Lead Score',
                    'sec-crm-allocation': 'Lead Allocation',
                    'sec-crm-agent': 'Agent',
                    'sec-crm-customflow': 'Custom Flow',
                    'sec-users':        'User Management',
                    'sec-security':     'Security & Compliance',
                    'sec-comms':        'Communication',
                    'sec-leads':        'Leads & Enrollment',
                    'sec-marketing':    'Marketing',
                    'sec-integrations': 'Integrations',
                    'sec-finance':      'Finance',
                    'sec-data':         'Data Administration'
                };
                var lbl = labelMap[sectionId] || sectionId;
                trackVisit(lbl, function(){ openSection(sectionId, accordionId); });
            };
        })();

        // ── API Keys ───────────────────────────────────────────────
        var AK_KEYS = [];
        var AK_NEXT_ID = 1;
        var AK_MODE = 'list'; // 'list' | 'create'
        var AK_PARTIAL_DATA = {};
        var AK_PENDING_KEY = null; // key being created, store {secretKey, accessKey}
        var AK_EDIT_ID = null;

        var AK_CATEGORIES = {
            'Lead': ['Create Lead','Update Lead','Create Or Update Lead','Get Lead Fields','Get Lead Details By Id','Get Lead Details By Email','Get Lead List API','Get Lead Details By Mobile Number','Post Dynamic Activity for Lead','Update Dynamic Activity for Lead','Bulk Post Dynamic Activity for Lead','Bulk Update Leads','Lead Delete'],
            'Dynamic Activity': ['Get Dynamic Activities','Create Dynamic Activity','Update Dynamic Activity','Delete Dynamic Activity'],
            'Opportunity': ['Get Opportunity List','Create Opportunity','Update Opportunity','Delete Opportunity'],
            'Activity': ['Get Activities','Create Activity','Update Activity'],
            'Form, Application & Payment': ['Get Application List','Create Application','Update Application','Get Payment List','Create Payment','Update Payment Status'],
            'Master Data': ['Get Master Data','Update Master Data','Get Taxonomy'],
            'User': ['Get User List','Get User Details','Create User','Update User'],
            'Team': ['Get Team List','Create Team','Update Team'],
            'Job': ['Get Job List','Create Job','Update Job'],
            'Qms': ['Get QMS List','Create QMS Entry'],
            'Exam': ['Get Exam List','Create Exam','Update Exam']
        };
        var AK_CURRENT_CAT = Object.keys(AK_CATEGORIES)[0];

        function akGenKey() {
            var chars = '0123456789abcdef';
            var key = '';
            for(var i=0;i<32;i++) key += chars[Math.floor(Math.random()*chars.length)];
            return key;
        }

        function akInit() {
            AK_MODE = 'list';
            akRender();
        }

        function akRender() {
            var body = document.getElementById('akBody');
            if (!body) { setTimeout(function(){ akRender(); }, 30); return; }
            if (AK_MODE === 'create' || AK_MODE === 'edit') { akRenderForm(body); return; }
            akRenderList(body);
        }

        var AK_FOOTER = '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 4px;margin-top:12px;font-size:13px;color:#6b7280">' +
            '<span>You can create a maximum of <strong style="color:#374151">20</strong> API Access Keys.</span>' +
            '<button onclick="akShowCreate()" style="background:none;border:none;color:#2563eb;font-size:13px;font-weight:700;cursor:pointer;padding:0;text-decoration:underline;text-underline-offset:3px;letter-spacing:-.01em;transition:color .13s" onmouseover="this.style.color=\'#1d4ed8\'" onmouseout="this.style.color=\'#2563eb\'">Create Access Key</button>' +
        '</div>';

        function akRenderList(body) {
            var html = '';

            if (AK_KEYS.length === 0) {
                html += '<div class="ak-empty">' +
                    '<div class="ak-empty-icon-wrap">' +
                        '<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                            '<circle cx="26" cy="26" r="26" fill="#EFF6FF"/>' +
                            '<path d="M22 28a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" stroke="#4f8ef7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
                            '<path d="M26 24h10l2 2-2 2h-2l-1-1-1 1h-2v-2" stroke="#4f8ef7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
                            '<circle cx="22" cy="22" r="1.5" fill="#4f8ef7"/>' +
                        '</svg>' +
                    '</div>' +
                    '<div class="ak-empty-title">No API Keys created yet</div>' +
                    '<div class="ak-empty-sub">Generate access keys to authenticate and interact with the Meritto Developer API. You can create up to 20 keys.</div>' +
                    '<div style="display:flex;gap:10px;align-items:center;justify-content:center">' +
                        '<button class="ak-create-btn" onclick="akShowCreate()" style="height:40px;padding:0 24px;border-radius:10px;font-size:13.5px">' +
                            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' +
                            ' Create Access Key' +
                        '</button>' +
                    '</div>' +
                    '<div class="ak-empty-hint">🔒 API keys are only shown once at creation. Store them securely.</div>' +
                '</div>';
            } else {
                html += '<div class="ak-list-card">';
                AK_KEYS.forEach(function(key) {
                    var isOpen = key._open;
                    var accessBadge = key.access === 'full'
                        ? '<span style="display:inline-flex;align-items:center;gap:5px;background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0;font-size:12px;font-weight:600;padding:3px 10px;border-radius:20px">🔓 Full Access</span>'
                        : '<span style="display:inline-flex;align-items:center;gap:5px;background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;font-size:12px;font-weight:600;padding:3px 10px;border-radius:20px">🔒 Partial Access</span>';

                    html += '<div class="ak-key-row' + (isOpen ? ' open' : '') + '" id="akrow-' + key.id + '">' +
                        // Row header
                        '<div class="ak-key-header" onclick="akToggleRow(' + key.id + ')">' +
                            '<div style="display:flex;align-items:center;gap:10px;flex:1">' +
                                '<div style="width:34px;height:34px;border-radius:9px;background:#eff6ff;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0">🔑</div>' +
                                '<div>' +
                                    '<div class="ak-key-name">' + key.title + '</div>' +
                                    '<div style="font-size:11.5px;color:#9ca3af;margin-top:1px">Created key • ' + (key.access === 'full' ? 'Full Access' : 'Partial Access') + '</div>' +
                                '</div>' +
                            '</div>' +
                            '<span class="ak-key-status ' + (key.enabled ? 'active-status' : 'inactive-status') + '">' + (key.enabled ? 'Active' : 'Inactive') + '</span>' +
                            '<button class="ak-toggle ' + (key.enabled ? 'on' : '') + '" onclick="event.stopPropagation();akToggleEnabled(' + key.id + ')"></button>' +
                            '<span class="ak-chevron" style="color:#c4c9d4">&#8964;</span>' +
                        '</div>' +
                        // Expanded body
                        '<div class="ak-key-body">' +
                          '<div class="ak-key-body-inner">' +

                            // Secret Key row
                            '<div class="ak-detail-row">' +
                              '<div class="ak-detail-label">Secret Key</div>' +
                              '<div class="ak-detail-val">' +
                                '<div class="ak-secret-row">' +
                                  '<span class="ak-secret-val">' + key.secretKey + '</span>' +
                                  '<button class="ak-copy-btn" onclick="navigator.clipboard.writeText(\'' + key.secretKey + '\')" title="Copy">' +
                                    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>' +
                                  '</button>' +
                                '</div>' +
                              '</div>' +
                            '</div>' +

                            // Access Type row
                            '<div class="ak-detail-row">' +
                              '<div class="ak-detail-label">Access Type</div>' +
                              '<div class="ak-detail-val" style="padding-top:8px">' + accessBadge + '</div>' +
                            '</div>' +

                            // Validity row
                            (key.startDate || key.endDate
                              ? '<div class="ak-detail-row">' +
                                  '<div class="ak-detail-label">Validity</div>' +
                                  '<div class="ak-validity-val">' + (key.startDate || '—') + ' <span class="ak-validity-arrow">→</span> ' + (key.endDate || '—') + '</div>' +
                                '</div>'
                              : '') +

                            // Whitelist IPs row
                            (key.ips && key.ips.length
                              ? '<div class="ak-detail-row">' +
                                  '<div class="ak-detail-label">Whitelist IPs</div>' +
                                  '<div class="ak-detail-val" style="display:flex;flex-wrap:wrap;gap:5px;padding-top:7px">' +
                                    key.ips.map(function(ip){ return '<span class="ak-ip-tag">' + ip + '</span>'; }).join('') +
                                  '</div>' +
                                '</div>'
                              : '') +

                            // Actions
                            '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px;padding-top:14px;border-top:1px solid #f0f2f5">' +
                              '<button onclick="akShowEdit(' + key.id + ')" style="height:34px;padding:0 18px;border-radius:8px;border:1.5px solid #e4e6ea;background:#fff;color:#374151;font-size:12.5px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all .13s" onmouseover="this.style.borderColor=\'#4f8ef7\';this.style.color=\'#4f8ef7\'" onmouseout="this.style.borderColor=\'#e4e6ea\';this.style.color=\'#374151\'">' +
                                '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit' +
                              '</button>' +
                              '<button onclick="akDeleteKey(' + key.id + ')" style="height:34px;padding:0 18px;border-radius:8px;border:1.5px solid #fca5a5;background:#fff;color:#ef4444;font-size:12.5px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all .13s" onmouseover="this.style.background=\'#ef4444\';this.style.color=\'#fff\';this.style.borderColor=\'#ef4444\'" onmouseout="this.style.background=\'#fff\';this.style.color=\'#ef4444\';this.style.borderColor=\'#fca5a5\'">' +
                                '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>Delete' +
                              '</button>' +
                            '</div>' +

                          '</div>' +
                        '</div>' +
                    '</div>';
                });
                html += '</div>';
                html += AK_FOOTER;
            }

            body.innerHTML = html;
        }

        function akRenderForm(body) {
            var isEdit = AK_MODE === 'edit';
            var key = isEdit ? AK_KEYS.find(function(k){ return k.id === AK_EDIT_ID; }) : { title:'', access:'full', startDate:'', endDate:'', ips:[] };
            var ipTags = (key.ips || []).map(function(ip){ return '<span class="ak-ip-tag">' + ip + '<button class="ak-ip-tag-remove" onclick="akRemoveIp(\'' + ip + '\')">✕</button></span>'; }).join('');

            body.innerHTML =
            '<div style="margin-bottom:16px">' +
              '<h2 style="font-size:18px;font-weight:700;color:#111827;margin:0;letter-spacing:-.02em">' + (isEdit ? 'Edit API Key' : 'Create API Key') + '</h2>' +
              '<p style="font-size:13px;color:#9ca3af;margin:4px 0 0">' + (isEdit ? 'Update the configuration for this access key.' : 'Generate a new access key for the Meritto Developer API.') + '</p>' +
            '</div>' +
            // Single connected card
            '<div class="ak-form-card" style="border-radius:14px;box-shadow:0 1px 4px rgba(0,0,0,.06)">' +

              // Section 1: Key Details
              '<div style="padding:20px 24px 0">' +
                '<div style="font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em;margin-bottom:16px">Key Details</div>' +
                '<div class="ak-form-row">' +
                  '<div class="ak-form-label">Title <span style="color:#ef4444">*</span></div>' +
                  '<div class="ak-form-field"><input class="ak-text-input" id="akTitleInput" placeholder="Enter a name for this key" value="' + (key.title||'') + '"></div>' +
                '</div>' +
                '<div class="ak-form-row" style="align-items:flex-start">' +
                  '<div class="ak-form-label" style="padding-top:14px">Setup Access</div>' +
                  '<div class="ak-form-field">' +
                    '<div class="ak-access-option' + (key.access==='full' ? ' selected' : '') + '" onclick="akSelectAccess(\'full\')" id="akOptFull" style="margin-bottom:8px">' +
                      '<div class="ak-access-option-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div>' +
                      '<div class="ak-access-option-text">' +
                        '<div class="ak-access-option-title">Enable Full Access</div>' +
                        '<div class="ak-access-option-desc">Full access provides the holder of the access key a complete access over all APIs published in developer portal. (GET & POST both).</div>' +
                      '</div>' +
                      '<div class="ak-access-radio"></div>' +
                    '</div>' +
                    '<div class="ak-access-option' + (key.access==='partial' ? ' selected' : '') + '" onclick="akSelectAccess(\'partial\')" id="akOptPartial">' +
                      '<div class="ak-access-option-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg></div>' +
                      '<div class="ak-access-option-text">' +
                        '<div class="ak-access-option-title">Enable Partial Access</div>' +
                        '<div class="ak-access-option-desc">Define limited access for a third party — choose exactly which APIs they can fetch or post data using this access key.</div>' +
                        (key.access==='partial' ? '<button class="ak-manage-link" onclick="event.stopPropagation();akOpenPartial()"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Manage Partial Access</button>' : '') +
                      '</div>' +
                      '<div class="ak-access-radio"></div>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +

              // Divider
              '<div style="height:1px;background:#f0f2f5;margin:20px 0"></div>' +

              // Section 2: Additional Settings
              '<div style="padding:0 24px 20px">' +
                '<div style="font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em;margin-bottom:16px">Additional Settings</div>' +
                '<div class="ak-form-row">' +
                  '<div class="ak-form-label">Start Date</div>' +
                  '<div class="ak-form-field">' +
                    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
                      '<div class="ak-date-wrap"><input class="ak-date-input" id="akStartDate" type="date" value="' + (key.startDate||'') + '"></div>' +
                      '<div style="display:flex;align-items:center;gap:10px">' +
                        '<span style="font-size:12.5px;font-weight:500;color:#6b7280;white-space:nowrap">End Date</span>' +
                        '<div class="ak-date-wrap" style="flex:1"><input class="ak-date-input" id="akEndDate" type="date" value="' + (key.endDate||'') + '"></div>' +
                      '</div>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
                '<div class="ak-form-row" style="margin-bottom:0">' +
                  '<div class="ak-form-label">Whitelist IP</div>' +
                  '<div class="ak-form-field">' +
                    '<div class="ak-ip-wrap" id="akIpWrap" onclick="document.getElementById(\'akIpInput\').focus()">' +
                      ipTags +
                      '<input class="ak-ip-input" id="akIpInput" placeholder="Enter IP and press Enter" onkeydown="akIpKeydown(event)">' +
                    '</div>' +
                    '<div style="font-size:11.5px;color:#9ca3af;margin-top:5px">Press Enter or comma to add multiple IPs</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +

              // Footer
              '<div class="ak-form-footer" style="border-radius:0 0 14px 14px">' +
                '<button class="ak-cancel-btn" onclick="akCancelForm()">Cancel</button>' +
                '<button class="ak-save-btn" onclick="akSaveKey()">' + (isEdit ? 'Save Changes' : 'Save') + '</button>' +
              '</div>' +

            '</div>';
        }

        window.akSelectAccess = function(type) {
            var full = document.getElementById('akOptFull');
            var partial = document.getElementById('akOptPartial');
            if (!full || !partial) return;
            full.classList.toggle('selected', type==='full');
            partial.classList.toggle('selected', type==='partial');
            // Show/hide manage link
            var existing = partial.querySelector('.ak-manage-link');
            if (type === 'partial' && !existing) {
                var btn = document.createElement('button');
                btn.className = 'ak-manage-link';
                btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Manage Partial Access';
                btn.onclick = function(e) { e.stopPropagation(); akOpenPartial(); };
                partial.querySelector('.ak-access-option-text').appendChild(btn);
            } else if (type === 'full' && existing) {
                existing.remove();
            }
        };

        window.akIpKeydown = function(e) {
            if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                var val = e.target.value.trim().replace(',','');
                if (!val) return;
                var wrap = document.getElementById('akIpWrap');
                var tag = document.createElement('span');
                tag.className = 'ak-ip-tag';
                tag.innerHTML = val + '<button class="ak-ip-tag-remove" onclick="this.parentElement.remove()">✕</button>';
                wrap.insertBefore(tag, e.target);
                e.target.value = '';
            }
        };

        window.akRemoveIp = function(ip) { akRender(); };

        window.akShowCreate = function() { AK_MODE = 'create'; AK_EDIT_ID = null; akRender(); };
        window.akShowEdit   = function(id) { AK_MODE = 'edit'; AK_EDIT_ID = id; akRender(); };
        window.akCancelForm = function() { AK_MODE = 'list'; akRender(); };

        window.akSaveKey = function() {
            var title = (document.getElementById('akTitleInput') || {}).value;
            if (!title || !title.trim()) { alert('Please enter a title for the key.'); return; }
            var access = document.getElementById('akOptFull').classList.contains('selected') ? 'full' : 'partial';
            var startDate = (document.getElementById('akStartDate')||{}).value || '';
            var endDate   = (document.getElementById('akEndDate')||{}).value || '';
            var ips = Array.from(document.querySelectorAll('#akIpWrap .ak-ip-tag')).map(function(t){ return t.textContent.replace('✕','').trim(); });

            if (AK_MODE === 'edit') {
                var key = AK_KEYS.find(function(k){ return k.id === AK_EDIT_ID; });
                if (key) { key.title=title.trim(); key.access=access; key.startDate=startDate; key.endDate=endDate; key.ips=ips; }
                AK_MODE = 'list'; akRender();
            } else {
                var secretKey = akGenKey();
                var accessKey = akGenKey();
                AK_PENDING_KEY = { secretKey: secretKey, accessKey: accessKey, title: title.trim(), access: access, startDate: startDate, endDate: endDate, ips: ips };
                akShowKeyDetails(secretKey, accessKey);
            }
        };

        window.akDeleteKey = function(id) {
            AK_KEYS = AK_KEYS.filter(function(k){ return k.id !== id; });
            akRender();
        };

        window.akToggleRow = function(id) {
            var key = AK_KEYS.find(function(k){ return k.id === id; });
            if (key) { key._open = !key._open; akRender(); }
        };

        window.akToggleEnabled = function(id) {
            var key = AK_KEYS.find(function(k){ return k.id === id; });
            if (key) { key.enabled = !key.enabled; akRender(); }
        };

        // ── Key Details Modal ──────────────────────────────────────
        function akShowKeyDetails(secret, access) {
            document.getElementById('akSecretDisplay').textContent = secret;
            document.getElementById('akAccessDisplay').textContent = access;
            document.getElementById('akConfirmCheck').checked = false;
            document.getElementById('akConfirmBtn').classList.remove('ready');
            document.getElementById('akDetailsOverlay').classList.add('show');
        }

        window.akCopy = function(type) {
            var val = type === 'secret'
                ? document.getElementById('akSecretDisplay').textContent
                : document.getElementById('akAccessDisplay').textContent;
            navigator.clipboard && navigator.clipboard.writeText(val);
        };

        window.akToggleConfirm = function(cb) {
            document.getElementById('akConfirmBtn').classList.toggle('ready', cb.checked);
        };

        window.akConfirmKeys = function() {
            if (!document.getElementById('akConfirmBtn').classList.contains('ready')) return;
            if (AK_PENDING_KEY) {
                AK_KEYS.push({ id: AK_NEXT_ID++, title: AK_PENDING_KEY.title, access: AK_PENDING_KEY.access, startDate: AK_PENDING_KEY.startDate, endDate: AK_PENDING_KEY.endDate, ips: AK_PENDING_KEY.ips, secretKey: AK_PENDING_KEY.secretKey, enabled: true, _open: false });
                AK_PENDING_KEY = null;
            }
            document.getElementById('akDetailsOverlay').classList.remove('show');
            AK_MODE = 'list';
            akRender();
        };

        // ── Partial Access Modal ───────────────────────────────────
        window.akOpenPartial = function() {
            AK_CURRENT_CAT = Object.keys(AK_CATEGORIES)[0];
            akRenderPartialCats();
            akRenderPartialApis('');
            document.getElementById('akPartialOverlay').classList.add('show');
        };

        window.akClosePartial = function() {
            document.getElementById('akPartialOverlay').classList.remove('show');
        };

        window.akSavePartial = function() {
            akClosePartial();
        };

        function akRenderPartialCats() {
            var cats = Object.keys(AK_CATEGORIES);
            document.getElementById('akPartialCats').innerHTML = cats.map(function(cat){
                return '<div class="ak-cat-item' + (cat === AK_CURRENT_CAT ? ' active' : '') + '" onclick="akSelectCat(\'' + cat.replace(/'/g,"\\'") + '\')">' + cat + '</div>';
            }).join('');
        }

        window.akSelectCat = function(cat) {
            AK_CURRENT_CAT = cat;
            akRenderPartialCats();
            akRenderPartialApis(document.getElementById('akApiSearch').value);
        };

        function akRenderPartialApis(query) {
            var apis = AK_CATEGORIES[AK_CURRENT_CAT] || [];
            var q = query.toLowerCase().trim();
            if (q) apis = apis.filter(function(a){ return a.toLowerCase().indexOf(q) !== -1; });
            document.getElementById('akApiList').innerHTML = apis.map(function(api){
                var key = AK_CURRENT_CAT + '::' + api;
                var on = AK_PARTIAL_DATA[key];
                return '<div class="ak-api-row">' +
                    '<span class="ak-api-name">' + api + '</span>' +
                    '<button class="ak-api-toggle' + (on ? ' on' : '') + '" onclick="akToggleApi(\'' + key.replace(/'/g,"\\'") + '\')"></button>' +
                '</div>';
            }).join('');
        }

        window.akToggleApi = function(key) {
            AK_PARTIAL_DATA[key] = !AK_PARTIAL_DATA[key];
            akRenderPartialApis(document.getElementById('akApiSearch').value);
        };

        window.akFilterApis = function(val) { akRenderPartialApis(val); };

        window.akInit = akInit;

        // Track visit
        var _origOpenApiKeys = window.openApiKeysView;
        window.openApiKeysView = function() {
            if (_origOpenApiKeys) _origOpenApiKeys();
            if (window.akInit) window.akInit();
            if (window.trackVisit) trackVisit('API Keys', function(){ window.openApiKeysView(); });
        };

        // ── Settings Customize Mode ────────────────────────────────
        (function() {
            var btn    = document.getElementById('stgCustomizeBtn');
            var banner = document.getElementById('stgCustomizeBanner');
            var home   = document.getElementById('stgHome');
            var active = false;
            var cardDragSrc = null;
            var itemDragSrc = null;
            var originalHTML = '';

            var GRIP_HTML = '<div class="stg-item-grip"><span></span><span></span><span></span></div>';

            function getCards() { return Array.from(home.querySelectorAll('.stg-card')); }
            function getItems(card) { return Array.from(card.querySelectorAll('.stg-card-item')); }

            function enterCustomize() {
                active = true;
                originalHTML = home.innerHTML;
                btn.classList.add('active');
                banner.classList.add('show');
                home.classList.add('customize-mode');
                // Inject item grips
                home.querySelectorAll('.stg-card-item').forEach(function(item) {
                    var grip = document.createElement('div');
                    grip.className = 'stg-item-grip';
                    grip.innerHTML = '<span></span><span></span><span></span>';
                    item.insertBefore(grip, item.firstChild);
                });
                bindCardDrag();
                bindItemDrag();
            }

            window.stgExitCustomize = function(reset) {
                active = false;
                btn.classList.remove('active');
                banner.classList.remove('show');
                home.classList.remove('customize-mode');
                if (reset && originalHTML) {
                    home.innerHTML = originalHTML;
                } else {
                    // Remove injected grips
                    home.querySelectorAll('.stg-item-grip').forEach(function(g){ g.remove(); });
                }
                unbindCardDrag();
                unbindItemDrag();
            };

            // ── Card drag ──────────────────────────────────────────
            function bindCardDrag() {
                getCards().forEach(function(card) {
                    card.setAttribute('draggable', 'true');
                    card._cds = function(e) {
                        // Prevent card drag if dragging an item
                        if (e.target.closest('.stg-card-item')) return;
                        cardDragSrc = card;
                        card.classList.add('dragging');
                        e.dataTransfer.effectAllowed = 'move';
                        e.dataTransfer.setData('text/plain', '');
                    };
                    card._cde = function() {
                        card.classList.remove('dragging');
                        getCards().forEach(function(c){ c.classList.remove('drag-over'); });
                    };
                    card._cdo = function(e) {
                        if (!cardDragSrc) return;
                        e.preventDefault();
                        getCards().forEach(function(c){ c.classList.remove('drag-over'); });
                        card.classList.add('drag-over');
                    };
                    card._cdp = function(e) {
                        e.preventDefault();
                        if (!cardDragSrc || cardDragSrc === card) return;
                        var cards = getCards();
                        var si = cards.indexOf(cardDragSrc), ti = cards.indexOf(card);
                        if (si < ti) home.insertBefore(cardDragSrc, card.nextSibling);
                        else home.insertBefore(cardDragSrc, card);
                        card.classList.remove('drag-over');
                        cardDragSrc = null;
                    };
                    card.addEventListener('dragstart', card._cds);
                    card.addEventListener('dragend',   card._cde);
                    card.addEventListener('dragover',  card._cdo);
                    card.addEventListener('drop',      card._cdp);
                });
            }

            function unbindCardDrag() {
                getCards().forEach(function(card) {
                    card.setAttribute('draggable', 'false');
                    ['_cds','_cde','_cdo','_cdp'].forEach(function(h){
                        var ev = {_cds:'dragstart',_cde:'dragend',_cdo:'dragover',_cdp:'drop'}[h];
                        if (card[h]) card.removeEventListener(ev, card[h]);
                    });
                });
            }

            // ── Item drag (within card) ───────────────────────────
            function bindItemDrag() {
                getCards().forEach(function(card) {
                    getItems(card).forEach(function(item) {
                        item.setAttribute('draggable', 'true');
                        item._ids = function(e) {
                            itemDragSrc = item;
                            cardDragSrc = null; // prevent card from dragging
                            item.classList.add('item-dragging');
                            e.dataTransfer.effectAllowed = 'move';
                            e.stopPropagation();
                        };
                        item._ide = function() {
                            item.classList.remove('item-dragging');
                            getItems(card).forEach(function(i){ i.classList.remove('item-drag-over'); });
                        };
                        item._ido = function(e) {
                            if (!itemDragSrc) return;
                            e.preventDefault();
                            e.stopPropagation();
                            getItems(card).forEach(function(i){ i.classList.remove('item-drag-over'); });
                            if (item !== itemDragSrc) item.classList.add('item-drag-over');
                        };
                        item._idp = function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!itemDragSrc || itemDragSrc === item) return;
                            // Only allow within same card
                            if (!card.contains(itemDragSrc)) return;
                            var items = getItems(card);
                            var si = items.indexOf(itemDragSrc), ti = items.indexOf(item);
                            if (si < ti) card.querySelector('.stg-card-items').insertBefore(itemDragSrc, item.nextSibling);
                            else card.querySelector('.stg-card-items').insertBefore(itemDragSrc, item);
                            item.classList.remove('item-drag-over');
                            itemDragSrc = null;
                        };
                        item.addEventListener('dragstart', item._ids);
                        item.addEventListener('dragend',   item._ide);
                        item.addEventListener('dragover',  item._ido);
                        item.addEventListener('drop',      item._idp);
                    });
                });
            }

            function unbindItemDrag() {
                home.querySelectorAll('.stg-card-item').forEach(function(item) {
                    item.setAttribute('draggable', 'false');
                    ['_ids','_ide','_ido','_idp'].forEach(function(h){
                        var ev = {_ids:'dragstart',_ide:'dragend',_ido:'dragover',_idp:'drop'}[h];
                        if (item[h]) item.removeEventListener(ev, item[h]);
                    });
                });
            }

            if (btn) btn.addEventListener('click', function() {
                if (active) stgExitCustomize(); else enterCustomize();
            });
        })();

        /* ═══════════════════════════════════════
           PAGE SWITCHER
        ═══════════════════════════════════════ */
        function showPage(name) {
            // Close settings overlay if open
            var settingsView = document.getElementById('settings-view');
            if (settingsView && settingsView.classList.contains('open')) {
                settingsView.classList.remove('open');
            }
            var instSelPage = document.querySelector('.institute-selector');
            if (instSelPage) instSelPage.style.display = '';
            // Close METS overlay if open
            var metsOverlay = document.getElementById('mets-overlay');
            if (metsOverlay && metsOverlay.style.display !== 'none') {
                if (window.closeMetsOverlay) closeMetsOverlay();
            }
            // Close Day Planner overlay if open
            var dayPlannerOverlayPg = document.getElementById('day-planner-overlay');
            if (dayPlannerOverlayPg && dayPlannerOverlayPg.style.display !== 'none') {
                if (window.closeDayPlanner) closeDayPlanner();
            }
            // Close Workflow Builder overlays if open
            var workflowOverlayPg = document.getElementById('workflow-overlay');
            if (workflowOverlayPg && workflowOverlayPg.style.display !== 'none') {
                if (window.closeWorkflowBuilder) closeWorkflowBuilder();
            }
            var workflowDesignerPg = document.getElementById('workflow-designer-overlay');
            if (workflowDesignerPg && workflowDesignerPg.style.display !== 'none') workflowDesignerPg.style.display = 'none';

            var dashboard = document.getElementById('page-dashboard');
            var usage = document.getElementById('page-usage');
            if (name === 'usage') {
                if (dashboard) { dashboard.classList.add('hidden'); dashboard.style.display = 'none'; }
                if (usage) { usage.style.display = 'flex'; usage.classList.add('active'); }
                var usageContent = document.getElementById('usageContent');
                if (usageContent && usageContent.innerHTML.trim() === '') {
                    renderUsage();
                }
                // Mark usage sidebar item active
                document.querySelectorAll('.sb-item').forEach(function(i){ i.classList.remove('active'); });
                var sbUsage = document.getElementById('sb-usage');
                if (sbUsage) sbUsage.classList.add('active');
            } else {
                if (usage) { usage.style.display = 'none'; usage.classList.remove('active'); }
                if (dashboard) { dashboard.classList.remove('hidden'); dashboard.style.display = 'block'; }
            }
        }

        /* ═══════════════════════════════════════
           USAGE PAGE DATA
        ═══════════════════════════════════════ */
        var MODS=[
          {name:"Lead Management",badge:"LM",bc:"#e6f1fb",bt:"#0c447c",features:[
            {n:"One View Lead Profile",pt:"Included in Plan",lt:"Flag"},
            {n:"Lead Manager Intake",pt:"Included in Plan",lt:"Capped",pl:50000,al:10000,con:34210},
            {n:"Lead Verification",pt:"Included in Plan",lt:"Flag"},
            {n:"Lead Fields",pt:"Included in Plan",lt:"Capped",pl:200,al:null,con:142},
            {n:"Custom Tabs",pt:"Included in Plan",lt:"Flag"},
            {n:"Bulk Offline Upload / Quick Add",pt:"Included in Plan",lt:"Flag"},
            {n:"Duplicate Blocking",pt:"Included in Plan",lt:"Flag"},
            {n:"Previous Session Data",pt:"Complementary",lt:"Flag"},
            {n:"Lead Source Tracking",pt:"Included in Plan",lt:"Flag"},
            {n:"Website Widget (Web Form)",pt:"Included in Plan",lt:"Capped",pl:10,al:3,con:8},
            {n:"Opportunity Management",pt:"Included in Plan",lt:"Flag"}
          ]},
          {name:"Counsellor Management",badge:"CM",bc:"#e1f5ee",bt:"#085041",features:[
            {n:"Predictive Analytics (Lead Score, Lead Strength)",pt:"Included in Plan",lt:"Flag"},
            {n:"Smart Views",pt:"Included in Plan",lt:"Flag"},
            {n:"Round Robin Lead Distribution",pt:"Included in Plan",lt:"Flag"},
            {n:"Advanced Lead Distribution (Business Logic)",pt:"Included in Plan",lt:"Flag"},
            {n:"Tasks & Follow Ups",pt:"Included in Plan",lt:"Flag"},
            {n:"Conversation Notes",pt:"Included in Plan",lt:"Flag"},
            {n:"Real time Notifications",pt:"Included in Plan",lt:"Flag"},
            {n:"Request and Schedule a Call Automation",pt:"Included in Plan",lt:"Flag"},
            {n:"Sales Reporting",pt:"Included in Plan",lt:"Flag"},
            {n:"One-on-one Emails",pt:"Included in Plan",lt:"Usage",unit:"per email"},
            {n:"One-on-One WhatsApp",pt:"Included in Plan",lt:"Flag"},
            {n:"Logic Based Lead Score",pt:"Included in Plan",lt:"Flag"}
          ]},
          {name:"User and Team Management",badge:"UM",bc:"#eeedfe",bt:"#3c3489",features:[
            {n:"Default Role Based Access",pt:"Included in Plan",lt:"Flag"},
            {n:"Custom Role Based Access",pt:"Included in Plan",lt:"Flag"},
            {n:"Teams & Hierarchy Management",pt:"Included in Plan",lt:"Flag"},
            {n:"Data Masking Module",pt:"Included in Plan",lt:"Flag"},
            {n:"Publisher Panel",pt:"Included in Plan",lt:"Flag"},
            {n:"Manage User Fields",pt:"Included in Plan",lt:"Flag"},
            {n:"Skill Based Allocation",pt:"Included in Plan",lt:"Flag"},
            {n:"Business Hours / Shift Hours",pt:"Included in Plan",lt:"Flag"},
            {n:"User License",pt:"Included in Plan",lt:"Capped",pl:30,al:10,con:24},
            {n:"Agent Module",pt:"Paid Addon",lt:"Flag"},
            {n:"Check In - Check Out with Allocation Quota",pt:"Paid Addon",lt:"Usage",unit:"per user"},
            {n:"Single sign-on",pt:"Paid Addon",lt:"Flag"},
            {n:"Publisher User",pt:"Paid Addon",lt:"Flag"},
            {n:"Auto Check-In / Auto Check-Out",pt:"Complementary",lt:"Flag"},
            {n:"Lead Allocation Quota",pt:"Complementary",lt:"Flag"},
            {n:"Application Allocation Quota",pt:"Complementary",lt:"Flag"},
            {n:"Opportunity Allocation Quota",pt:"Complementary",lt:"Flag"}
          ]},
          {name:"Reports and Analytics",badge:"RA",bc:"#faeeda",bt:"#633806",isAddon:true,features:[
            {n:"Reports",pt:"Included in Addon",lt:"Capped",pl:10,al:4,con:9},
            {n:"Trend Analysis",pt:"Included in Addon",lt:"Flag"}
          ]},
          {name:"Logs",badge:"LG",bc:"#f1efe8",bt:"#5f5e5a",features:[
            {n:"Data Flow Logs",pt:"Included in Plan",lt:"Flag"},
            {n:"Data Porting",pt:"Included in Plan",lt:"Flag"},
            {n:"Daily Cumulative Count Log",pt:"Included in Plan",lt:"Flag"},
            {n:"Client API",pt:"Included in Plan",lt:"Flag"}
          ]},
          {name:"Mobile CRM",badge:"MC",bc:"#e6f1fb",bt:"#185fa5",features:[
            {n:"Mobile App Usage",pt:"Included in Plan",lt:"Flag"},
            {n:"Field Force Tracking",pt:"Included in Plan",lt:"Flag"},
            {n:"App Telephony",pt:"Paid Addon",lt:"Usage",unit:"per user"},
            {n:"Field Force Tracking with Auto Check-in",pt:"Paid Addon",lt:"Usage",unit:"per user"}
          ]},
          {name:"Developer Portal",badge:"DP",bc:"#e1f5ee",bt:"#0f6e56",features:[
            {n:"APIs Framework",pt:"Included in Plan",lt:"Flag"},
            {n:"Single API Rate Limits (per 5 sec)",pt:"Included in Plan",lt:"Capped",pl:20,al:null,con:14},
            {n:"Bulk API Rate Limits (per 5 sec)",pt:"Paid Addon",lt:"Flag"}
          ]},
          {name:"Webhook",badge:"WH",bc:"#faeeda",bt:"#854f0b",isAddon:true,features:[
            {n:"Webhooks",pt:"Included in Addon",lt:"Flag"}
          ]},
          {name:"Extensions",badge:"EX",bc:"#eeedfe",bt:"#534ab7",features:[
            {n:"Extensions",pt:"Included in Plan",lt:"Flag"},
            {n:"Calendar Pro",pt:"Included in Plan",lt:"Flag"},
            {n:"Zoho Creator",pt:"Complementary",lt:"Flag"},
            {n:"Centre Module",pt:"Complementary",lt:"Flag"},
            {n:"ToDo",pt:"Complementary",lt:"Flag"},
            {n:"Echo",pt:"Paid Addon",lt:"Flag"},
            {n:"Amplify",pt:"Paid Addon",lt:"Usage",unit:"per message"},
            {n:"Zing",pt:"Paid Addon",lt:"Flag"},
            {n:"DocVerify",pt:"Paid Addon",lt:"Flag"},
            {n:"Facebook Offline Conversion",pt:"Paid Addon",lt:"Flag"},
            {n:"Smart Forms",pt:"Paid Addon",lt:"Flag"}
          ]},
          {name:"Telephony Connector",badge:"TC",bc:"#fcebeb",bt:"#791f1f",features:[
            {n:"Telephony Connector (Click to Call)",pt:"Paid Addon",lt:"Flag"},
            {n:"Telephony Connector (Campaign Dialer)",pt:"Paid Addon",lt:"Usage",unit:"per user"}
          ]},
          {name:"WABA Connector",badge:"WA",bc:"#e1f5ee",bt:"#0f6e56",features:[
            {n:"WhatsApp Business API",pt:"Paid Addon",lt:"Flag"},
            {n:"WhatsApp (Marketing)",pt:"Paid Addon",lt:"Usage",unit:"per message"},
            {n:"WhatsApp (Utility)",pt:"Paid Addon",lt:"Usage",unit:"per message"},
            {n:"WhatsApp (Service)",pt:"Paid Addon",lt:"Usage",unit:"per message"},
            {n:"WhatsApp (Authentication)",pt:"Paid Addon",lt:"Usage",unit:"per message"},
            {n:"WhatsApp Flows",pt:"Included in Addon",lt:"Capped",pl:2,al:1,con:2}
          ]},
          {name:"SMS Connector",badge:"SM",bc:"#faeeda",bt:"#633806",features:[
            {n:"SMS (inclusive of DLT Charges)",pt:"Paid Addon",lt:"Usage",unit:"per SMS"}
          ]},
          {name:"Email Connector",badge:"EC",bc:"#e6f1fb",bt:"#0c447c",features:[
            {n:"Email",pt:"Paid Addon",lt:"Usage",unit:"per email"},
            {n:"Dedicated IP for Email",pt:"Paid Addon",lt:"Usage",unit:"per IP"}
          ]},
          {name:"Marketing Platform",badge:"MP",bc:"#faece7",bt:"#712b13",features:[
            {n:"Responsive Landing Page Builder",pt:"Included in Plan",lt:"Capped",pl:5,al:2,con:4},
            {n:"Remarketing Connectors - Google",pt:"Included in Plan",lt:"Flag"},
            {n:"Remarketing Connectors - Facebook",pt:"Included in Plan",lt:"Flag"},
            {n:"Conversion Tags Integration",pt:"Included in Plan",lt:"Flag"},
            {n:"Drag & Drop Email Template Builder",pt:"Included in Plan",lt:"Flag"},
            {n:"Responsive Email Template Gallery",pt:"Included in Plan",lt:"Flag"},
            {n:"Responsive Email Campaigns",pt:"Included in Plan",lt:"Flag"},
            {n:"SMS Campaigns",pt:"Included in Plan",lt:"Flag"},
            {n:"Recurring Communication",pt:"Included in Plan",lt:"Flag"},
            {n:"Drip Marketing Automation & Workflow",pt:"Included in Plan",lt:"Capped",pl:20,al:19,con:17},
            {n:"Communication Performance Reports",pt:"Included in Plan",lt:"Flag"},
            {n:"Google Lead Ad Connectors",pt:"Paid Addon",lt:"Flag"},
            {n:"Facebook Lead Ad Connectors",pt:"Paid Addon",lt:"Flag"}
          ]},
          {name:"Raw Data",badge:"RD",bc:"#f1efe8",bt:"#5f5e5a",features:[
            {n:"Raw Data Nurturing Module",pt:"Paid Addon",lt:"Flag"},
            {n:"List Segmentation",pt:"Included in Addon",lt:"Flag"}
          ]},
          {name:"Campaign Management",badge:"CG",bc:"#e1f5ee",bt:"#085041",features:[
            {n:"Campaign Dashboard",pt:"Included in Plan",lt:"Flag"},
            {n:"Lead Verification Index",pt:"Included in Plan",lt:"Flag"},
            {n:"Channel Classification",pt:"Included in Plan",lt:"Flag"},
            {n:"Inventory Classification",pt:"Included in Plan",lt:"Flag"},
            {n:"Mutually Exclusive Impact (MEI)",pt:"Included in Plan",lt:"Flag"},
            {n:"Source Performance Report",pt:"Included in Plan",lt:"Flag"},
            {n:"Lead Flow Algorithm",pt:"Included in Plan",lt:"Flag"}
          ]},
          {name:"Application Automation Platform",badge:"AP",bc:"#eeedfe",bt:"#3c3489",features:[
            {n:"Application Form Automation",pt:"Included in Plan",lt:"Flag"},
            {n:"Application Forms Development & Hosting",pt:"Included in Plan",lt:"Capped",pl:5,al:1,con:3},
            {n:"Student Admission Portal",pt:"Included in Plan",lt:"Flag"},
            {n:"SAP Whitelabelled URL",pt:"Included in Plan",lt:"Flag"},
            {n:"Query Management System",pt:"Included in Plan",lt:"Flag"},
            {n:"Document Manager (Single Download)",pt:"Included in Plan",lt:"Flag"},
            {n:"Document Manager (Bulk Download)",pt:"Included in Plan",lt:"Flag"},
            {n:"Email/SMS Notifications (Standard)",pt:"Included in Plan",lt:"Flag"},
            {n:"Email/SMS Notifications (Custom)",pt:"Included in Plan",lt:"Flag"},
            {n:"Login via Application Number",pt:"Included in Plan",lt:"Flag"},
            {n:"Login via OTP",pt:"Included in Plan",lt:"Flag"},
            {n:"Aadhar Authentication",pt:"Included in Plan",lt:"Flag"},
            {n:"Offer Letter Placement",pt:"Included in Plan",lt:"Flag"},
            {n:"School Dashboards",pt:"Complementary",lt:"Flag"},
            {n:"Test Admin View",pt:"Complementary",lt:"Flag"},
            {n:"Application Intake",pt:"Paid Addon",lt:"Usage",unit:"per application"},
            {n:"Referral Connect",pt:"Paid Addon",lt:"Flag"}
          ]},
          {name:"Payment Management",badge:"PM",bc:"#e1f5ee",bt:"#0f6e56",features:[
            {n:"Application / Token Fees Collection",pt:"Included in Plan",lt:"Flag"},
            {n:"Discount/Voucher Management",pt:"Included in Plan",lt:"Flag"},
            {n:"Token Fees / Installment Payment",pt:"Included in Plan",lt:"Flag"},
            {n:"Client Payment Gateway Connector",pt:"Paid Addon",lt:"Flag"}
          ]},
          {name:"Mio AI",badge:"MO",bc:"#eeedfe",bt:"#534ab7",features:[
            {n:"MIO AI Guide",pt:"Paid Addon",lt:"Flag"},
            {n:"MIO AI Voice",pt:"Paid Addon",lt:"Flag"}
          ]},
          {name:"Dynamic Activity",badge:"DY",bc:"#e6f1fb",bt:"#185fa5",features:[
            {n:"Dynamic Activity",pt:"Included in Plan",lt:"Usage",unit:"per activity"},
            {n:"Dynamic Fields",pt:"Included in Plan",lt:"Usage",unit:"per field"}
          ]},
          {name:"Miscellaneous",badge:"MS",bc:"#f1efe8",bt:"#5f5e5a",features:[
            {n:"Onsite Training",pt:"Included in Plan",lt:"Capped",pl:2,al:null,con:1},
            {n:"Virtual Training (Zoom)",pt:"Included in Plan",lt:"Capped",pl:4,al:null,con:2}
          ]}
        ];

        /* ═══════════════════════════════════════
           USAGE HELPERS
        ═══════════════════════════════════════ */
        function fmt(n){return n!=null?Number(n).toLocaleString():'0';}
        function fmtK(n){if(n>=1000){var k=n/1000;return(k===Math.floor(k)?k:k.toFixed(1))+'K';}return String(n);}
        function capCls(p){return p>=0.9?'crit':p>=0.7?'warn':'ok';}

        function checkSvg(col){
          return '<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 2.5" stroke="'+col+'" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        }

        function renderCapRow(f){
          var an=f.al&&parseInt(f.al)?parseInt(f.al):0;
          var tot=(f.pl||0)+an, p=tot>0?f.con/tot:0;
          var pct=Math.round(p*100), cls=capCls(p);
          var planPct=tot>0?Math.round((f.pl||0)/tot*100):100;
          var trackStyle=an>0?'background:linear-gradient(to right,var(--border-1) 0%,var(--border-1) '+planPct+'%,#EDE9FE '+planPct+'%,#EDE9FE 100%)':'';
          var planLine=an>0?'<div class="cap-plan-line" style="left:'+planPct+'%"></div>':'';
          var barHtml='<div class="cap-bar">'
            +'<div class="cap-track"'+(trackStyle?' style="'+trackStyle+'"':'')+'>'
            +'<div class="cap-fill '+cls+'" style="width:'+Math.max(pct,2)+'%"></div>'
            +'</div>'
            +planLine
            +'</div>';
          var planChip='<span class="cap-plan-chip">'+fmtK(f.pl||0)+' plan</span>';
          var addonChip=an>0?'<span class="cap-addon-chip">+'+fmtK(an)+' add-on</span>':'';
          return '<div class="cap-cell">'
            +'<div class="cap-top">'+barHtml+'<span class="cap-pct '+cls+'">'+pct+'%</span></div>'
            +'<div class="cap-bottom">'
            +'<div class="cap-chips">'+planChip+addonChip+'</div>'
            +'<span class="cap-used-text">'+fmt(f.con)+' used</span>'
            +'</div>'
            +'</div>';
        }

        function renderMod(mod, idx){
          var isAddon=!!mod.isAddon;
          var included=mod.features.filter(function(f){return f.pt==='Included in Plan'||f.pt==='Complementary'||f.pt==='Included in Addon';});
          var paid=mod.features.filter(function(f){return f.pt==='Paid Addon';});

          var capIndicators='';
          mod.features.filter(function(f){return f.lt==='Capped';}).forEach(function(f){
            var an=f.al&&parseInt(f.al)?parseInt(f.al):0;
            var tot=(f.pl||0)+an, p=tot>0?f.con/tot:0;
            if(p>=0.7){
              var pct=Math.round(p*100), cls=p>=0.9?'crit':'warn';
              var short=f.n.length>20?f.n.slice(0,20)+'…':f.n;
              capIndicators+='<span class="hdr-cap-badge '+cls+'">'+pct+'% '+short+'</span>';
            }
          });

          var h='<div class="mod-card'+(isAddon?' is-addon':'')+'" id="mc'+idx+'">';
          h+='<div class="mod-hdr" onclick="toggleMod('+idx+')">'
            +'<span class="mod-badge" style="background:'+mod.bc+';color:'+mod.bt+'">'+mod.badge+'</span>'
            +'<div class="mod-name-wrap">'
            +'<span class="mod-name">'+mod.name+'</span>'
            +(isAddon?'<span class="addon-mod-chip">Add-on module</span>':'')
            +'</div>'
            +'<div class="mod-hdr-right">';
          if(capIndicators) h+='<div style="display:flex;align-items:center;gap:4px">'+capIndicators+'</div>';
          if(paid.length>0) h+='<span class="hdr-addon-pill">'+paid.length+' add-on'+(paid.length>1?'s':'')+'</span>';
          h+='<span class="mod-feat-count">'+mod.features.length+' features</span>'
            +'<span class="mod-arr"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 5.5l3.5 3.5 3.5-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>'
            +'</div></div>';

          h+='<div class="mod-body" id="mb'+idx+'">';

          if(included.length){
            h+='<div class="sec-block" id="inc'+idx+'">'
              +'<div class="sec-block-hdr">'
              +'<span class="sec-eyebrow">Included in your plan</span>'
              +'<span class="sec-count">'+included.length+'</span>'
              +'</div>'
              +'<div class="ft">';

            included.forEach(function(f){
              var tbCls, tbLbl;
              if(f.pt==='Included in Plan'){tbCls='tb-plan';tbLbl='Plan';}
              else if(f.pt==='Complementary'){tbCls='tb-comp';tbLbl='Comp';}
              else{tbCls='tb-inaddon';tbLbl='Add-on';}

              h+='<div class="ft-row" data-pt="'+f.pt+'" data-name="'+f.n.toLowerCase()+'">';
              h+='<div class="ft-name-col"><span class="ft-name">'+f.n+'</span></div>';
              h+='<div class="ft-badge-col"><span class="tb '+tbCls+'">'+tbLbl+'</span></div>';
              h+='<div class="ft-status-col">';

              if(f.lt==='Capped'){
                h+=renderCapRow(f);
              } else if(f.lt==='Flag'){
                if(f.pt==='Complementary'){
                  h+='<span class="si si-comp">'+checkSvg('#6B7280')+' Complementary</span>';
                } else if(f.pt==='Included in Addon'){
                  h+='<span class="si si-active">'+checkSvg('#534ab7')+' Active</span>';
                } else {
                  h+='<span class="si si-enabled">'+checkSvg('#1a9e6e')+' Enabled</span>';
                }
              } else if(f.lt==='Usage'){
                var cls2=f.pt==='Included in Addon'?'addon-usage':'plan-usage';
                h+='<span class="payg '+cls2+'">Pay as you go · '+(f.unit||'usage')+'</span>';
              }

              h+='</div></div>';
            });

            h+='</div></div>';
          }

          if(paid.length){
            h+='<div class="sec-block addon-sec-block" id="add'+idx+'">'
              +'<div class="sec-block-hdr">'
              +'<span class="sec-eyebrow">Paid Add-ons</span>'
              +'<span class="sec-count">'+paid.length+'</span>'
              +'</div>'
              +'<div class="ft">';

            paid.forEach(function(f){
              h+='<div class="ft-row" data-pt="'+f.pt+'" data-name="'+f.n.toLowerCase()+'">';
              h+='<div class="ft-name-col"><span class="ft-name">'+f.n+'</span></div>';
              h+='<div class="ft-badge-col"><span class="tb tb-paid">Add-on</span></div>';
              h+='<div class="ft-status-col">';
              if(f.lt==='Usage'){
                h+='<span class="payg paid-usage">Pay as you go · '+(f.unit||'usage')+'</span>';
              } else if(f.lt==='Capped'){
                h+=renderCapRow(f);
              } else {
                h+='<span class="si si-paid">'+checkSvg('#854f0b')+' Active</span>';
              }
              h+='</div></div>';
            });

            h+='</div></div>';
          }

          h+='</div></div>';
          return h;
        }

        function renderUsage(){
          var totalF=0, planF=0, compF=0, paidF=0;
          var cappedWarn=[], cappedCrit=[];

          MODS.forEach(function(m){
            m.features.forEach(function(f){
              totalF++;
              if(f.pt==='Included in Plan'||f.pt==='Included in Addon') planF++;
              else if(f.pt==='Complementary') compF++;
              else if(f.pt==='Paid Addon') paidF++;
              if(f.lt==='Capped'){
                var an=f.al&&parseInt(f.al)?parseInt(f.al):0;
                var tot=(f.pl||0)+an, p=tot>0?f.con/tot:0;
                if(p>=0.9) cappedCrit.push({n:f.n,pct:Math.round(p*100)});
                else if(p>=0.7) cappedWarn.push({n:f.n,pct:Math.round(p*100)});
              }
            });
          });

          var subStart=new Date('2026-04-01'), subEnd=new Date('2027-03-31');
          var today=new Date(); today.setHours(0,0,0,0);
          var totalDays=Math.ceil((subEnd-subStart)/864e5);
          var elapsed=Math.max(0,Math.ceil((today-subStart)/864e5));
          var daysLeft=Math.max(0,Math.ceil((subEnd-today)/864e5));
          var elapsedPct=Math.round(Math.min(elapsed/totalDays,1)*100);
          var alertCount=cappedCrit.length+cappedWarn.length;

          var h='';
          h+='<div class="usage-page-header">'
            +'<div><div class="usage-heading">Subscription &amp; Usage</div>'
            +'<div class="usage-heading-sub">Meritto Edu Tech Ltd. · Enrollment Cloud</div></div>'
            +'</div>';

          h+='<div class="summary-grid">';
          h+='<div class="s-card featured">'
            +'<div class="s-card-eyebrow">Package</div>'
            +'<div class="s-card-val">Enrollment Cloud</div>'
            +'<div class="s-card-sub">Meritto CRM Platform</div>'
            +'<div><span class="plan-pill">Growth Plan</span></div>'
            +'</div>';

          h+='<div class="s-card">'
            +'<div class="s-card-eyebrow">Subscription Period</div>'
            +'<div class="s-card-val">'+daysLeft+'</div>'
            +'<div class="s-card-sub">days remaining</div>'
            +'<div class="sub-bar"><div class="sub-bar-fill" style="width:'+elapsedPct+'%"></div></div>'
            +'<div class="s-card-sub">Apr 1, 2026 – Mar 31, 2027</div>'
            +'</div>';

          h+='<div class="s-card">'
            +'<div class="s-card-eyebrow">Features Enabled</div>'
            +'<div class="s-card-val">'+totalF+'</div>'
            +'<div class="s-card-sub">Across '+MODS.length+' modules</div>'
            +'<div class="s-card-breakdown">'
            +'<span class="s-dot-item"><span class="s-dot" style="background:#1a9e6e"></span>'+planF+' in plan</span>'
            +'<span class="s-dot-item"><span class="s-dot" style="background:#9CA3AF"></span>'+compF+' comp</span>'
            +'<span class="s-dot-item"><span class="s-dot" style="background:#e8900a"></span>'+paidF+' add-ons</span>'
            +'</div>'
            +'</div>';

          var alertCardContent;
          if(alertCount===0){
            alertCardContent='<div class="all-ok">'+checkSvg('#1a9e6e')+' All within limits</div>';
          } else {
            alertCardContent='<div class="alert-lines">';
            cappedCrit.slice(0,2).forEach(function(c){
              alertCardContent+='<div class="alert-line"><span class="alert-dot" style="background:#DC2626"></span>'
                +'<span>'+c.n.slice(0,26)+(c.n.length>26?'…':'')+'</span>'
                +'<strong style="color:#DC2626;margin-left:auto">'+c.pct+'%</strong></div>';
            });
            cappedWarn.slice(0,2).forEach(function(c){
              alertCardContent+='<div class="alert-line"><span class="alert-dot" style="background:#e8900a"></span>'
                +'<span>'+c.n.slice(0,26)+(c.n.length>26?'…':'')+'</span>'
                +'<strong style="color:#e8900a;margin-left:auto">'+c.pct+'%</strong></div>';
            });
            alertCardContent+='</div>';
          }
          h+='<div class="s-card" style="'+(alertCount>0?'border-color:#FDE68A;':'')+'">'
            +'<div class="s-card-eyebrow">Capacity Alerts</div>'
            +'<div class="s-card-val" style="color:'+(alertCount===0?'#1a9e6e':cappedCrit.length>0?'#DC2626':'#e8900a')+'">'+alertCount+'</div>'
            +'<div class="s-card-sub">'+(alertCount===0?'No features near limit':cappedCrit.length+' critical · '+cappedWarn.length+' warning')+'</div>'
            +alertCardContent
            +'</div>';

          h+='</div>';

          h+='<div class="ctrl-bar">'
            +'<div class="ctrl-left">'
            +'<span class="sec-title">Feature Breakdown</span>'
            +'<span class="count-pill" id="countPill">'+totalF+' features · '+MODS.length+' modules</span>'
            +'</div>'
            +'<div class="ctrl-right">'
            +'<div class="search-wrap">'
            +'<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4" stroke="#9CA3AF" stroke-width="1.3"/><path d="M9 9l3 3" stroke="#9CA3AF" stroke-width="1.3" stroke-linecap="round"/></svg>'
            +'<input type="text" id="searchInput" placeholder="Search features or modules…" oninput="applyFilters()">'
            +'</div>'
            +'<div class="filter-wrap">'
            +'<div class="filter-btn" id="filterBtn" onclick="toggleFilterMenu()">'
            +'<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 3h10M3 6h6M5 9h2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>'
            +'<span id="filterLabel">All types</span>'
            +'<div class="f-caret"></div>'
            +'</div>'
            +'<div class="filter-menu" id="filterMenu">'
            +'<div class="fopt sel" id="fopt-all" onclick="setFilter(\'all\')"><div class="fcheck">'+checkSvg('#fff')+'</div>All features</div>'
            +'<div class="fopt" id="fopt-plan" onclick="setFilter(\'plan\')"><div class="fcheck"></div><span class="fdot" style="background:#1a9e6e"></span>Included in plan</div>'
            +'<div class="fopt" id="fopt-comp" onclick="setFilter(\'comp\')"><div class="fcheck"></div><span class="fdot" style="background:#9CA3AF"></span>Complementary</div>'
            +'<div class="fopt" id="fopt-addon" onclick="setFilter(\'addon\')"><div class="fcheck"></div><span class="fdot" style="background:#e8900a"></span>Paid add-on</div>'
            +'</div>'
            +'</div>'
            +'<div class="tgl-group">'
            +'<button class="tgl-btn" id="btn-expand" onclick="expandAll()">'
            +'<svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1.5 4L5.5 7.5 9.5 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
            +'Expand all</button>'
            +'<button class="tgl-btn" id="btn-collapse" onclick="collapseAll()">'
            +'<svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1.5 7L5.5 3.5 9.5 7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
            +'Collapse all</button>'
            +'</div>'
            +'</div></div>';

          h+='<div class="mod-list" id="modList">';
          MODS.forEach(function(m,i){h+=renderMod(m,i);});
          h+='</div><div style="height:32px"></div>';

          document.getElementById('usageContent').innerHTML=h;
          var c0=document.getElementById('mc0');
          if(c0) c0.classList.add('open');
        }

        var activeFilter='all';
        var PT_MAP={plan:'Included in Plan', addon:'Paid Addon', comp:'Complementary'};

        function toggleFilterMenu(){
          var fm=document.getElementById('filterMenu');
          if(fm) fm.classList.toggle('open');
        }

        function setFilter(type){
          activeFilter=type;
          ['all','plan','addon','comp'].forEach(function(t){
            var el=document.getElementById('fopt-'+t); if(!el) return;
            el.classList.toggle('sel',t===type);
            var chk=el.querySelector('.fcheck');
            if(chk) chk.innerHTML=t===type?checkSvg('#fff'):'';
          });
          var labels={all:'All types',plan:'Included in plan',addon:'Paid add-on',comp:'Complementary'};
          var lbl=document.getElementById('filterLabel'); if(lbl) lbl.textContent=labels[type]||'All types';
          var btn=document.getElementById('filterBtn'); if(btn) btn.classList.toggle('filtered',type!=='all');
          var fm=document.getElementById('filterMenu'); if(fm) fm.classList.remove('open');
          applyFilters();
        }

        function applyFilters(){
          var q=(document.getElementById('searchInput').value||'').toLowerCase().trim();
          var targetPt=activeFilter!=='all'?PT_MAP[activeFilter]:null;
          var totalVf=0, totalVm=0;

          MODS.forEach(function(mod,idx){
            var card=document.getElementById('mc'+idx); if(!card) return;
            var modNameMatch=!q||mod.name.toLowerCase().indexOf(q)>-1;
            var rows=card.querySelectorAll('.ft-row[data-pt]');
            var visCount=0;

            rows.forEach(function(row){
              var pt=row.getAttribute('data-pt');
              var name=row.getAttribute('data-name')||'';
              var typeOk=!targetPt||pt===targetPt;
              var searchOk=!q||modNameMatch||name.indexOf(q)>-1;
              var show=typeOk&&searchOk;
              row.style.display=show?'':'none';
              if(show) visCount++;
            });

            ['inc','add'].forEach(function(prefix){
              var block=document.getElementById(prefix+idx); if(!block) return;
              var blockRows=block.querySelectorAll('.ft-row[data-pt]');
              var anyVis=Array.from(blockRows).some(function(r){return r.style.display!=='none';});
              block.style.display=anyVis?'':'none';
            });

            var showMod=visCount>0;
            card.style.display=showMod?'':'none';

            if(showMod&&(targetPt||q)) card.classList.add('open');
            if(!targetPt&&!q){
              card.classList.toggle('open',idx===0);
              card.querySelectorAll('.sec-block').forEach(function(b){b.style.display='';});
            }
            if(showMod){totalVm++;totalVf+=visCount;}
          });

          var cp=document.getElementById('countPill');
          if(cp) cp.textContent=totalVf+' features · '+totalVm+' modules';
        }

        function toggleMod(idx){
          var c=document.getElementById('mc'+idx);
          if(!c) return;
          c.classList.toggle('open');
          var be=document.getElementById('btn-expand');
          var bc=document.getElementById('btn-collapse');
          if(be) be.classList.remove('active');
          if(bc) bc.classList.remove('active');
        }

        function expandAll(){
          var btn=document.getElementById('btn-expand');
          if(!btn) return;
          if(btn.classList.contains('active')){
            MODS.forEach(function(_,i){var c=document.getElementById('mc'+i);if(c)c.classList.toggle('open',i===0);});
            btn.classList.remove('active');
          } else {
            MODS.forEach(function(_,i){var c=document.getElementById('mc'+i);if(c&&c.style.display!=='none')c.classList.add('open');});
            btn.classList.add('active');
            var bc=document.getElementById('btn-collapse'); if(bc) bc.classList.remove('active');
          }
        }

        function collapseAll(){
          var btn=document.getElementById('btn-collapse');
          if(!btn) return;
          if(btn.classList.contains('active')){
            MODS.forEach(function(_,i){var c=document.getElementById('mc'+i);if(c)c.classList.toggle('open',i===0);});
            btn.classList.remove('active');
          } else {
            MODS.forEach(function(_,i){var c=document.getElementById('mc'+i);if(c)c.classList.remove('open');});
            btn.classList.add('active');
            var be=document.getElementById('btn-expand'); if(be) be.classList.remove('active');
          }
        }

        // Close usage filter menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.filter-wrap')) {
                var fm = document.getElementById('filterMenu');
                if (fm) fm.classList.remove('open');
            }
        });
    

/* ─────────────────── */


    (function(){
        var _metsObserver = null;
        function _syncMetsLeft() {
            var sb = document.getElementById('sidebar');
            var overlay = document.getElementById('mets-overlay');
            if (sb && overlay) overlay.style.left = sb.getBoundingClientRect().width + 'px';
        }
        window.openMetsOverlay = function() {
            // Close comm-log overlays if open so METS appears on top
            var commLog = document.getElementById('comm-log-overlay');
            if (commLog && commLog.style.display !== 'none') {
                if (window.closeCommLog) window.closeCommLog();
            }
            var commDetail = document.getElementById('comm-detail-overlay');
            if (commDetail && commDetail.style.display !== 'none') {
                if (window.closeCommDetail) window.closeCommDetail();
            }
            // Close Day Planner overlay if open so METS appears on top
            var dayPlannerOverlayMets = document.getElementById('day-planner-overlay');
            if (dayPlannerOverlayMets && dayPlannerOverlayMets.style.display !== 'none') {
                if (window.closeDayPlanner) closeDayPlanner();
            }
            // Close Workflow Builder overlays if open so METS appears on top
            var workflowOverlayMets = document.getElementById('workflow-overlay');
            if (workflowOverlayMets && workflowOverlayMets.style.display !== 'none') {
                if (window.closeWorkflowBuilder) closeWorkflowBuilder();
            }
            var workflowDesignerMets = document.getElementById('workflow-designer-overlay');
            if (workflowDesignerMets && workflowDesignerMets.style.display !== 'none') workflowDesignerMets.style.display = 'none';
            // Sync Testing Credits Report tab visibility with toggle state
            var toggleCb = document.getElementById('testing-report-toggle');
            var tab = document.getElementById('tab-testing-report');
            if (toggleCb && tab) tab.style.display = toggleCb.checked ? '' : 'none';
            var overlay = document.getElementById('mets-overlay');
            _syncMetsLeft();
            overlay.style.display = 'block';
            // Watch sidebar width changes (expand/collapse)
            var sb = document.getElementById('sidebar');
            if (sb && window.ResizeObserver && !_metsObserver) {
                _metsObserver = new ResizeObserver(_syncMetsLeft);
                _metsObserver.observe(sb);
            }
        };
        window.closeMetsOverlay = function() {
            document.getElementById('mets-overlay').style.display = 'none';
            if (_metsObserver) { _metsObserver.disconnect(); _metsObserver = null; }
        };
    })();
    var _commLogObserver = null;
    var _commDetailObserver = null;
    var _commLogRows = [];
    function _syncCommDetailLeft() {
        var sb = document.getElementById('sidebar');
        var overlay = document.getElementById('comm-detail-overlay');
        if (sb && overlay) overlay.style.left = sb.getBoundingClientRect().width + 'px';
    }
    function _syncCommLogLeft() {
        var sb = document.getElementById('sidebar');
        var overlay = document.getElementById('comm-log-overlay');
        if (sb && overlay) overlay.style.left = sb.getBoundingClientRect().width + 'px';
    }
    function openCommLog(el) {
        var jobId = el ? el.textContent.trim() : 'EML-10045';

        // Derive channel from job prefix
        var prefix = jobId.split('-')[0];
        var channelMap = {
            'EML':  { label:'Email',      color:'#2563eb', bg:'#eff6ff',   icon:'<svg width="13" height="13" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="13" rx="2" stroke="#2563eb" stroke-width="1.5"/><path d="M2 7l8 5 8-5" stroke="#2563eb" stroke-width="1.5"/></svg>' },
            'SMS':  { label:'SMS',        color:'#059669', bg:'#ecfdf5',   icon:'<svg width="13" height="13" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="11" rx="2" stroke="#059669" stroke-width="1.5"/><path d="M6 17l4-2 4 2" stroke="#059669" stroke-width="1.3"/></svg>' },
            'WA':   { label:'WhatsApp',   color:'#16a34a', bg:'#f0fdf4',   icon:'<svg width="13" height="13" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#16a34a" stroke-width="1.5"/><path d="M7.5 10c0 1.4 1.1 2.5 2.5 2.5.7 0 1.3-.3 1.8-.7l.9.2-.2-.9c.4-.5.7-1.1.7-1.8C13.2 7.9 11.7 7 10 7c-1.4 0-2.5 1.1-2.5 3z" stroke="#16a34a" stroke-width="1.3"/></svg>' },
            'AIV':  { label:'AI Voice',   color:'#7c3aed', bg:'#ede9fe',   icon:'<svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M10 2v16M6 5v10M2 8v4M14 5v10M18 8v4" stroke="#7c3aed" stroke-width="1.5" stroke-linecap="round"/></svg>' }
        };
        var ch = channelMap[prefix] || channelMap['EML'];

        // Sample data per job
        var dataMap = {
            'EML-10045': { preview:'Summer Admission Reminder', template:'Admission Reminder v2', status:'Completed', statusColor:'#16a34a', date:'10 JUN, 26  9:30 AM', listName:'3', segment:'Open Leads', audience:'400', delivered:'380', autoId:'NA', campaign:'Summer 2026', campType:'Bulk', form:'All Forms', sentBy:'Internal User', retry:false },
            'SMS-20115': { preview:'Application Status Update',  template:'Status Update SMS',    status:'Completed', statusColor:'#16a34a', date:'12 JUN, 26 11:15 AM', listName:'2', segment:'Shortlisted', audience:'300', delivered:'295', autoId:'NA', campaign:'Outreach Q2', campType:'Bulk', form:'All Forms', sentBy:'Internal User', retry:false },
            'SMS-20087': { preview:'Automation Follow-up SMS',   template:'Follow-up Template',   status:'In Progress', statusColor:'#d97706', date:'15 JUN, 26  2:45 PM', listName:'1', segment:'-', audience:'200', delivered:'-', autoId:'AUTO-2087', campaign:'NA', campType:'Automation', form:'All Forms', sentBy:'System', retry:true },
            'WA-00325':  { preview:'WhatsApp Offer Notification',template:'Offer Letter WA',      status:'Completed', statusColor:'#16a34a', date:'11 JUN, 26  4:00 PM', listName:'4', segment:'Enrolled', audience:'100', delivered:'98', autoId:'NA', campaign:'Enroll Drive', campType:'Bulk', form:'Form A', sentBy:'Internal User', retry:false },
            'EML-10052': { preview:'Automation Welcome Email',   template:'Welcome Email v1',     status:'In Progress', statusColor:'#d97706', date:'15 JUN, 26  8:20 AM', listName:'1', segment:'-', audience:'100', delivered:'-', autoId:'AUTO-1052', campaign:'NA', campType:'Automation', form:'All Forms', sentBy:'System', retry:false },
            'AIV-00089': { preview:'Mio AI Voice - Outbound',   template:'-',                    status:'In Progress', statusColor:'#d97706', date:'17 JUN, 26 10:05 AM', listName:'1', segment:'-', audience:'100', delivered:'-', autoId:'AUTO-0089', campaign:'NA', campType:'Automation', form:'All Forms', sentBy:'System', retry:true }
        };
        var d = dataMap[jobId] || dataMap['EML-10045'];

        var TD      = 'padding:11px 16px;color:#374151;font-size:12.5px;white-space:nowrap;border-bottom:1px solid #f3f4f6;background:#fff;';
        var TD_SL   = 'padding:11px 16px;color:#374151;font-size:12.5px;white-space:nowrap;border-bottom:1px solid #f3f4f6;position:sticky;left:0;background:#fff;z-index:1;box-shadow:2px 0 4px rgba(0,0,0,0.06);';
        var TD_SL2  = 'padding:11px 16px;color:#374151;font-size:12.5px;white-space:nowrap;border-bottom:1px solid #f3f4f6;position:sticky;left:50px;background:#fff;z-index:1;box-shadow:2px 0 4px rgba(0,0,0,0.06);';
        var TD_SR   = 'padding:11px 16px;color:#374151;font-size:12.5px;white-space:nowrap;border-bottom:1px solid #f3f4f6;position:sticky;right:0;background:#fff;z-index:1;box-shadow:-2px 0 4px rgba(0,0,0,0.06);text-align:center;';

        var retryCell = d.retry
            ? '<span style="background:#f3f4f6;color:#6b7280;border-radius:20px;padding:4px 12px;font-size:11.5px;font-weight:500;">Feature not applicable</span>'
            : '-';

        var tbody = document.getElementById('comm-log-tbody');
        if (tbody) {
            tbody.innerHTML =
                '<tr onmouseover="this.querySelectorAll(\'td\').forEach(function(t){t.style.background=\'#f8fafc\'})" onmouseout="this.querySelectorAll(\'td\').forEach(function(t){t.style.background=\'#fff\'})">' +
                '<td style="' + TD_SL + 'width:36px;padding:11px 8px 11px 14px;"><input type="checkbox" style="width:14px;height:14px;cursor:pointer;accent-color:#2563eb;"></td>' +
                '<td style="' + TD_SL2 + '">' +
                  '<div style="display:flex;align-items:center;gap:7px;">' +
                  '<span style="display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:6px;background:' + ch.bg + ';">' + ch.icon + '</span>' +
                  '<a href="javascript:void(0)" style="color:#2563eb;font-size:12.5px;font-weight:600;text-decoration:none;" onmouseover="this.style.textDecoration=\'underline\';" onmouseout="this.style.textDecoration=\'none\';">' + jobId + '</a>' +
                  '</div></td>' +
                '<td style="' + TD + '">' + d.preview + '</td>' +
                '<td style="' + TD + '">' + d.template + '</td>' +
                '<td style="' + TD + '"><span style="color:' + d.statusColor + ';font-weight:600;font-size:12px;">' + d.status + '</span></td>' +
                '<td style="' + TD + '">' + d.date + '</td>' +
                '<td style="' + TD + '"><a href="javascript:void(0)" style="color:#2563eb;text-decoration:none;" onmouseover="this.style.textDecoration=\'underline\';" onmouseout="this.style.textDecoration=\'none\';">' + d.listName + '</a></td>' +
                '<td style="' + TD + '">' + d.segment + '</td>' +
                '<td style="' + TD + '">' + d.audience + '</td>' +
                '<td style="' + TD + '">' + d.delivered + '</td>' +
                '<td style="' + TD + '">' + d.autoId + '</td>' +
                '<td style="' + TD + '">' + d.campaign + '</td>' +
                '<td style="' + TD + '">' + d.campType + '</td>' +
                '<td style="' + TD + '">' + d.form + '</td>' +
                '<td style="' + TD + '">' + d.sentBy + '</td>' +
                '<td style="' + TD + '">' + retryCell + '</td>' +
                '<td style="' + TD_SR + '">' +
                '<button onclick="commActionToggle(this,event)" style="background:none;border:none;cursor:pointer;color:#6b7280;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:6px;" onmouseover="this.style.background=\'#f3f4f6\'" onmouseout="this.style.background=\'\'" title="Actions"><svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><circle cx="4" cy="10" r="1.5"/><circle cx="10" cy="10" r="1.5"/><circle cx="16" cy="10" r="1.5"/></svg></button>' +
                '</td>' +
                '</tr>';
        }

                var overlay = document.getElementById('comm-log-overlay');
        _syncCommLogLeft();
        overlay.style.display = 'block';
        var sb = document.getElementById('sidebar');
        if (sb && window.ResizeObserver && !_commLogObserver) {
            _commLogObserver = new ResizeObserver(_syncCommLogLeft);
            _commLogObserver.observe(sb);
        }
    }
    function openCommLogList() {
        var channelMap = {
            'EML': { bg:'#eff6ff', icon:'<svg width="13" height="13" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="13" rx="2" stroke="#2563eb" stroke-width="1.5"/><path d="M2 7l8 5 8-5" stroke="#2563eb" stroke-width="1.5"/></svg>' },
            'SMS': { bg:'#ecfdf5', icon:'<svg width="13" height="13" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="11" rx="2" stroke="#059669" stroke-width="1.5"/><path d="M6 17l4-2 4 2" stroke="#059669" stroke-width="1.3"/></svg>' },
            'WA':  { bg:'#f0fdf4', icon:'<svg width="13" height="13" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#16a34a" stroke-width="1.5"/><path d="M7.5 10c0 1.4 1.1 2.5 2.5 2.5.7 0 1.3-.3 1.8-.7l.9.2-.2-.9c.4-.5.7-1.1.7-1.8C13.2 7.9 11.7 7 10 7c-1.4 0-2.5 1.1-2.5 3z" stroke="#16a34a" stroke-width="1.3"/></svg>' },
            'AIV': { bg:'#ede9fe', icon:'<svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M10 2v16M6 5v10M2 8v4M14 5v10M18 8v4" stroke="#7c3aed" stroke-width="1.5" stroke-linecap="round"/></svg>' }
        };
        var rows = [
            { job:'EML-10045', preview:'Summer Admission Reminder',    template:'Admission Reminder v2', status:'Completed',  statusColor:'#16a34a', date:'10 Jun, 26  9:30 AM', list:'3', segment:'Open Leads',      audience:'400' },
            { job:'SMS-20115', preview:'Application Status Update',    template:'Status Update SMS',     status:'Completed',  statusColor:'#16a34a', date:'12 Jun, 26 11:15 AM', list:'2', segment:'Shortlisted',     audience:'300' },
            { job:'SMS-20087', preview:'Automation Follow-up SMS',     template:'Follow-up Template',    status:'In Progress', statusColor:'#d97706', date:'15 Jun, 26  2:45 PM', list:'1', segment:'-',               audience:'200' },
            { job:'WA-00325',  preview:'WhatsApp Offer Notification',  template:'Offer Letter WA',       status:'Completed',  statusColor:'#16a34a', date:'11 Jun, 26  4:00 PM', list:'4', segment:'Enrolled',        audience:'100' },
            { job:'EML-10052', preview:'Automation Welcome Email',     template:'Welcome Email v1',      status:'In Progress', statusColor:'#d97706', date:'15 Jun, 26  8:20 AM', list:'1', segment:'-',               audience:'100' },
            { job:'AIV-00089', preview:'Mio AI Voice - Outbound',      template:'-',                     status:'In Progress', statusColor:'#d97706', date:'17 Jun, 26 10:05 AM', list:'1', segment:'-',               audience:'100' },
            { job:'EML-10061', preview:"Happy Women's Day!!! Avail...",template:'Automation Template',   status:'In Progress', statusColor:'#d97706', date:'17 Aug, 26 12:53 PM', list:'1', segment:'-',               audience:'0'   },
            { job:'SMS-20142', preview:'Fee Payment Reminder',         template:'Fee Reminder SMS',      status:'Completed',  statusColor:'#16a34a', date:'09 Aug, 26 10:10 AM', list:'2', segment:'Fee Due',         audience:'560' },
            { job:'WA-00341',  preview:'Document Upload Nudge',        template:'Doc Nudge WA',          status:'Failed',     statusColor:'#dc2626', date:'08 Aug, 26  3:35 PM', list:'1', segment:'Incomplete Apps', audience:'75'  },
            { job:'EML-10078', preview:'Counsellor Assigned Notice',   template:'Counsellor Assigned v1',status:'Completed',  statusColor:'#16a34a', date:'06 Aug, 26  9:05 AM', list:'3', segment:'New Leads',       audience:'212' },
            { job:'SMS-20150', preview:'Interview Slot Confirmation',  template:'Slot Confirm SMS',      status:'Completed',  statusColor:'#16a34a', date:'05 Aug, 26  1:20 PM', list:'1', segment:'Shortlisted',     audience:'88'  },
            { job:'AIV-00094', preview:'Mio AI Voice - Reminder Call', template:'-',                     status:'In Progress', statusColor:'#d97706', date:'04 Aug, 26 11:40 AM', list:'1', segment:'-',               audience:'140' }
        ];
        _commLogRows = rows;

        var TD     = 'padding:11px 16px;color:#374151;font-size:12.5px;white-space:nowrap;border-bottom:1px solid #f3f4f6;background:#fff;';
        var TD_SL  = 'padding:11px 16px;color:#374151;font-size:12.5px;white-space:nowrap;border-bottom:1px solid #f3f4f6;position:sticky;left:0;background:#fff;z-index:1;box-shadow:2px 0 4px rgba(0,0,0,0.06);';
        var TD_SL2 = 'padding:11px 16px;color:#374151;font-size:12.5px;white-space:nowrap;border-bottom:1px solid #f3f4f6;position:sticky;left:50px;background:#fff;z-index:1;box-shadow:2px 0 4px rgba(0,0,0,0.06);';
        var TD_SR  = 'padding:11px 16px;color:#374151;font-size:12.5px;white-space:nowrap;border-bottom:1px solid #f3f4f6;position:sticky;right:0;background:#fff;z-index:1;box-shadow:-2px 0 4px rgba(0,0,0,0.06);text-align:center;';

        var tbody = document.getElementById('comm-log-tbody');
        if (tbody) {
            tbody.innerHTML = rows.map(function(d) {
                var ch = channelMap[d.job.split('-')[0]] || channelMap['EML'];
                return '<tr onmouseover="this.querySelectorAll(\'td\').forEach(function(t){t.style.background=\'#f8fafc\'})" onmouseout="this.querySelectorAll(\'td\').forEach(function(t){t.style.background=\'#fff\'})">' +
                    '<td style="' + TD_SL + 'width:36px;padding:11px 8px 11px 14px;"><input type="checkbox" style="width:14px;height:14px;cursor:pointer;accent-color:#2563eb;"></td>' +
                    '<td style="' + TD_SL2 + '">' +
                      '<div style="display:flex;align-items:center;gap:7px;">' +
                      '<span style="display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:6px;background:' + ch.bg + ';">' + ch.icon + '</span>' +
                      '<a href="javascript:void(0)" onclick="openCommDetail(' + "'" + d.job + "'" + ')" style="color:#2563eb;font-size:12.5px;font-weight:600;text-decoration:none;" onmouseover="this.style.textDecoration=\'underline\';" onmouseout="this.style.textDecoration=\'none\';">' + d.job + '</a>' +
                      '</div></td>' +
                    '<td style="' + TD + '">' + d.preview + '</td>' +
                    '<td style="' + TD + '">' + d.template + '</td>' +
                    '<td style="' + TD + '"><span style="color:' + d.statusColor + ';font-weight:600;font-size:12px;">' + d.status + '</span></td>' +
                    '<td style="' + TD + '">' + d.date + '</td>' +
                    '<td style="' + TD + '"><a href="javascript:void(0)" style="color:#2563eb;text-decoration:none;" onmouseover="this.style.textDecoration=\'underline\';" onmouseout="this.style.textDecoration=\'none\';">' + d.list + '</a></td>' +
                    '<td style="' + TD + '">' + d.segment + '</td>' +
                    '<td style="' + TD + '">' + d.audience + '</td>' +
                    '<td style="' + TD + '">-</td>' +
                    '<td style="' + TD + '">NA</td>' +
                    '<td style="' + TD + '">NA</td>' +
                    '<td style="' + TD + '">-</td>' +
                    '<td style="' + TD + '">-</td>' +
                    '<td style="' + TD + '">Internal User</td>' +
                    '<td style="' + TD + '">-</td>' +
                    '<td style="' + TD_SR + '">' +
                    '<button onclick="commActionToggle(this,event)" style="background:none;border:none;cursor:pointer;color:#6b7280;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:6px;" onmouseover="this.style.background=\'#f3f4f6\'" onmouseout="this.style.background=\'\'" title="Actions"><svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><circle cx="4" cy="10" r="1.5"/><circle cx="10" cy="10" r="1.5"/><circle cx="16" cy="10" r="1.5"/></svg></button>' +
                    '</td>' +
                    '</tr>';
            }).join('');
        }
        var totalEl = document.getElementById('comm-log-total');
        if (totalEl) totalEl.textContent = '749';

        var overlay = document.getElementById('comm-log-overlay');
        _syncCommLogLeft();
        overlay.style.display = 'block';
        var sb2 = document.getElementById('sidebar');
        if (sb2 && window.ResizeObserver && !_commLogObserver) {
            _commLogObserver = new ResizeObserver(_syncCommLogLeft);
            _commLogObserver.observe(sb2);
        }
    }
    window.openCommLogList = openCommLogList;
    var _commDetailTypeMap = { 'EML':'Email', 'SMS':'SMS', 'WA':'Whatsapp', 'AIV':'AI Voice' };
    var _commDetailCurrent = { type:'Email', sentCount:0 };
    function openCommDetail(jobId) {
        var d = _commLogRows.filter(function(r){ return r.job === jobId; })[0] || { template:'Automation Template' };
        var type = _commDetailTypeMap[jobId.split('-')[0]] || 'Email';
        var recipients = [
            { name:'Test MrYogesh',   email:'y*******@meritto.com' },
            { name:'testing purpose', email:'t*******@meritto.com' }
        ];
        _commDetailCurrent = { type:type, sentCount:recipients.length };
        var statsLabel = document.getElementById('comm-detail-stats-label');
        if (statsLabel) statsLabel.textContent = type + ' Stats';
        var statsPanel = document.getElementById('comm-detail-stats');
        if (statsPanel) statsPanel.style.display = 'none';
        var TD = 'padding:11px 16px;color:#374151;font-size:12.5px;white-space:nowrap;border-bottom:1px solid #f3f4f6;background:#fff;';
        var tbody = document.getElementById('comm-detail-tbody');
        if (tbody) {
            tbody.innerHTML = recipients.map(function(r) {
                return '<tr>' +
                    '<td style="' + TD + '">NA</td>' +
                    '<td style="' + TD + '">' + jobId.replace(/^[A-Z]+-/, '') + '</td>' +
                    '<td style="' + TD + '">' + type + '</td>' +
                    '<td style="' + TD + '">' + r.name + '</td>' +
                    '<td style="' + TD + '">Lead</td>' +
                    '<td style="' + TD + '">NA</td>' +
                    '<td style="' + TD + '">' + d.template + '</td>' +
                    '<td style="' + TD + '"><a href="javascript:void(0)" style="color:#2563eb;text-decoration:none;">' + r.email + '</a></td>' +
                    '<td style="' + TD + '">11 Aug 2026 06:00 pm</td>' +
                    '<td style="' + TD + '"><span style="color:#16a34a;font-weight:600;">Sent</span></td>' +
                    '<td style="' + TD + 'text-align:center;"><button style="background:none;border:none;cursor:pointer;color:#6b7280;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:6px;" onmouseover="this.style.background=\'#f3f4f6\'" onmouseout="this.style.background=\'\'" title="Actions"><svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="10" cy="10" r="2.2"/><path d="M10 3v2M10 15v2M3 10h2M15 10h2M5.6 5.6l1.4 1.4M13 13l1.4 1.4M5.6 14.4L7 13M13 7l1.4-1.4"/></svg></button></td>' +
                    '</tr>';
            }).join('');
        }
        var totalEl = document.getElementById('comm-detail-total');
        if (totalEl) totalEl.textContent = recipients.length;
        var overlay = document.getElementById('comm-detail-overlay');
        _syncCommDetailLeft();
        overlay.style.display = 'block';
        var sb = document.getElementById('sidebar');
        if (sb && window.ResizeObserver && !_commDetailObserver) {
            _commDetailObserver = new ResizeObserver(_syncCommDetailLeft);
            _commDetailObserver.observe(sb);
        }
    }
    window.openCommDetail = openCommDetail;
    window.closeCommDetail = function closeCommDetail() {
        document.getElementById('comm-detail-overlay').style.display = 'none';
        if (_commDetailObserver) { _commDetailObserver.disconnect(); _commDetailObserver = null; }
    };
    function commDetailToggleStats() {
        var panel = document.getElementById('comm-detail-stats');
        if (!panel) return;
        if (panel.style.display === 'flex') { panel.style.display = 'none'; return; }
        var sent = _commDetailCurrent.sentCount || 0;
        // On-Hold METS = sent minus whatever has already been reconciled by a delivery pingback
        // (confirmed-delivered METS are consumed; failed/undelivered METS are reversed to the wallet).
        var deliveredCount = sent;
        var failedCount = 0;
        var heldMets = Math.max(0, sent - deliveredCount - failedCount);
        var cards = [
            { label:'Sent',          value:String(sent),      count:null, color:'#ec4899' },
            { label:'Delivered',     value:'100.00%',         count:sent, color:'#f59e0b' },
            { label:'Read',          value:'100.00%',         count:sent, color:'#22c55e' },
            { label:'Failed',        value:'0%',              count:0,    color:'#ef4444' },
            { label:'Clicked',       value:'0%',              count:0,    color:'#7c3aed' },
            { label:'Replied',       value:'0%',              count:0,    color:'#111827' },
            { label:'Unsubscribed',  value:'0%',              count:0,    color:'#14b8a6' },
            { label:'Flow Response', value:'0%',              count:0,    color:'#3b82f6' },
            { label:'On-Hold METS',  value:String(heldMets),  count:null, color:'#d97706' }
        ];
        panel.innerHTML = cards.map(function(c) {
            return '<div style="flex:1;min-width:150px;background:#fff;border:1px solid #e5e9f2;border-radius:10px;padding:14px 16px 12px;border-bottom:3px solid ' + c.color + ';box-shadow:0 1px 3px rgba(0,0,0,0.03);">' +
                '<div style="display:flex;align-items:center;gap:5px;font-size:12px;color:#6b7280;margin-bottom:8px;white-space:nowrap;">' + c.label +
                ' <span style="display:inline-flex;align-items:center;justify-content:center;width:13px;height:13px;border-radius:50%;border:1px solid #9ca3af;font-size:8.5px;color:#9ca3af;flex-shrink:0;">i</span></div>' +
                '<div style="font-size:21px;font-weight:800;color:#111827;line-height:1.1;">' + c.value + '</div>' +
                (c.count !== null ? '<div style="font-size:11.5px;color:#9ca3af;margin-top:3px;">' + c.count + '</div>' : '') +
                '</div>';
        }).join('');
        panel.style.display = 'flex';
    }
    window.commDetailToggleStats = commDetailToggleStats;
    var _commActionBtn = null;
    function commActionToggle(btn, e) {
        e.stopPropagation();
        var menu = document.getElementById('comm-action-menu');
        if (_commActionBtn === btn && menu.style.display === 'block') {
            menu.style.display = 'none';
            _commActionBtn = null;
            return;
        }
        _commActionBtn = btn;
        var rect = btn.getBoundingClientRect();
        menu.style.display = 'block';
        // Position below button, right-aligned
        var menuW = 170;
        var left  = rect.right - menuW;
        if (left < 8) left = 8;
        menu.style.top  = (rect.bottom + 6) + 'px';
        menu.style.left = left + 'px';
    }
    function commActionDropdownClick(action) {
        var savedBtn = _commActionBtn;   // save before nulling
        document.getElementById('comm-action-menu').style.display = 'none';
        _commActionBtn = null;
        if (action === 'delivery-report') {
            openDeliveryReport(savedBtn);
        }
    }
    function openDeliveryReport(actionBtn) {
        var metrics = [
            { label:'Sent',               info:false, tooltip:'',                                           pct:100, count:2, color:'#3b82f6', dot:'#3b82f6', bg:'#eff6ff', iconPath:'<path d="M7 10l2.5 2.5L13 7" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' },
            { label:'Delivered',          info:false, tooltip:'',                                           pct:0,   count:0, color:'#10b981', dot:'#10b981', bg:'#f0fdf4', iconPath:'<path d="M6.5 10l2 2L13.5 7" stroke="#10b981" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' },
            { label:'DND',                info:false, tooltip:'',                                           pct:0,   count:0, color:'#f59e0b', dot:'#f59e0b', bg:'#fffbeb', iconPath:'<path d="M10 7v3M10 13h.01" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round"/>' },
            { label:'Absent Subscriber',  info:false, tooltip:'',                                           pct:0,   count:0, color:'#f59e0b', dot:'#f59e0b', bg:'#fffbeb', iconPath:'<path d="M10 7v3M10 13h.01" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round"/>' },
            { label:'Invalid Subscriber', info:false, tooltip:'',                                           pct:0,   count:0, color:'#ef4444', dot:'#ef4444', bg:'#fef2f2', iconPath:'<path d="M7.5 7.5l5 5M12.5 7.5l-5 5" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round"/>' },
            { label:'MSG Inbox Full',     info:false, tooltip:'',                                           pct:0,   count:0, color:'#ef4444', dot:'#ef4444', bg:'#fef2f2', iconPath:'<path d="M7.5 7.5l5 5M12.5 7.5l-5 5" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round"/>' },
            { label:'Failed',             info:false, tooltip:'',                                           pct:0,   count:0, color:'#dc2626', dot:'#dc2626', bg:'#fef2f2', iconPath:'<path d="M7.5 7.5l5 5M12.5 7.5l-5 5" stroke="#dc2626" stroke-width="1.5" stroke-linecap="round"/>' },
            { label:'Status Awaited',     info:true,  tooltip:'Delivery status pending vendor confirmation', pct:100, count:2, color:'#8b5cf6', dot:'#8b5cf6', bg:'#f5f3ff', iconPath:'<path d="M10 7v3l1.5 1.5" stroke="#8b5cf6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' }
        ];

        // Resolve job ID from clicked row
        var resolvedJobId = null;
        var jobLabel = document.getElementById('dr-job-label');
        if (actionBtn) {
            var row = actionBtn.closest('tr');
            if (row) {
                // Find all <a> tags in the row; first one is the job ID link
                var links = row.querySelectorAll('a');
                if (links.length > 0) {
                    resolvedJobId = links[0].textContent.trim();
                    if (jobLabel) jobLabel.textContent = 'Job ID: ' + resolvedJobId;
                }
            }
        }

        var holdMetsVal = '—';

        // Adjusted METS config per job
        var deltaMap = {
            'EML-10045': { type: 'reversed',     delta: '+50'  },
            'SMS-20115': { type: 'mixed',         rev: '+80',   over: '−45' },
            'SMS-20087': { type: 'overconsumed',  delta: '−30' },
            'WA-00325':  { type: 'reversed',      delta: '+20'  },
            'EML-10052': { type: 'overconsumed',  delta: '−15' },
            'AIV-00089': { type: 'reversed',      delta: '+10'  },
        };
        var dCfg = deltaMap[resolvedJobId] || { type: 'pending' };
        var mets = { hold: holdMetsVal, type: dCfg.type, delta: dCfg.delta, rev: dCfg.rev, over: dCfg.over };

        // Populate On-hold METS
        var holdEl = document.getElementById('dr-hold-mets');
        if (holdEl) holdEl.textContent = mets.hold;

        // Populate Adjusted METS
        var deltaEl    = document.getElementById('dr-delta-mets');
        var deltaLabel = document.getElementById('dr-delta-label');
        var deltaIconBg = document.getElementById('dr-delta-icon-bg');
        var deltaIcon  = document.getElementById('dr-delta-icon');

        if (mets.type === 'mixed') {
            if (deltaEl)    { deltaEl.innerHTML = '<span style="color:#16a34a;font-size:18px;font-weight:800;">' + mets.rev + '</span> <span style="color:#6b7280;font-size:14px;">/</span> <span style="color:#dc2626;font-size:18px;font-weight:800;">' + mets.over + '</span>'; }
            if (deltaLabel) deltaLabel.textContent = 'Reversed · Over-consumed';
            if (deltaIconBg) deltaIconBg.style.background = '#f0fdf4';
            if (deltaIcon)  deltaIcon.innerHTML = '<path d="M7 10l3-3 3 3M10 7v6" stroke="#16a34a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>';
        } else if (mets.type === 'reversed') {
            if (deltaEl)    { deltaEl.textContent = mets.delta; deltaEl.style.color = '#16a34a'; }
            if (deltaLabel) deltaLabel.textContent = 'Reversed to wallet';
            if (deltaIconBg) deltaIconBg.style.background = '#f0fdf4';
            if (deltaIcon)  deltaIcon.innerHTML = '<path d="M10 14V6M6 10l4-4 4 4" stroke="#16a34a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>';
        } else if (mets.type === 'overconsumed') {
            if (deltaEl)    { deltaEl.textContent = mets.delta; deltaEl.style.color = '#dc2626'; }
            if (deltaLabel) deltaLabel.textContent = 'Extra deducted';
            if (deltaIconBg) deltaIconBg.style.background = '#fef2f2';
            if (deltaIcon)  deltaIcon.innerHTML = '<path d="M10 6v8M6 10l4 4 4-4" stroke="#dc2626" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>';
        } else {
            if (deltaEl)    { deltaEl.textContent = '—'; deltaEl.style.color = '#9ca3af'; }
            if (deltaLabel) deltaLabel.textContent = 'Awaiting settlement';
            if (deltaIconBg) deltaIconBg.style.background = '#f3f4f6';
            if (deltaIcon)  deltaIcon.innerHTML = '<path d="M10 7v3l1.5 1.5" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>';
        }

        var rows = document.getElementById('delivery-report-rows');
        rows.innerHTML = metrics.map(function(m) {
            var infoIcon = m.info ? '<span style="display:inline-flex;align-items:center;justify-content:center;width:13px;height:13px;border-radius:50%;border:1.5px solid #d1d5db;font-size:9px;color:#9ca3af;cursor:default;margin-left:5px;flex-shrink:0;" title="' + m.tooltip + '">i</span>' : '';
            var filled = m.pct > 0;
            var textColor = m.pct > 50 ? '#fff' : (filled ? m.color : '#9ca3af');
            return '<div style="background:#fff;border-radius:10px;border:1px solid #e5e9f2;padding:13px 16px;display:flex;align-items:center;gap:12px;box-shadow:0 1px 3px rgba(0,0,0,0.04);">' +
                // Icon circle
                '<div style="width:34px;height:34px;border-radius:8px;background:' + m.bg + ';display:flex;align-items:center;justify-content:center;flex-shrink:0;">' +
                    '<svg width="14" height="14" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="' + m.dot + '" stroke-width="1.6"/>' + m.iconPath + '</svg>' +
                '</div>' +
                // Label
                '<div style="width:140px;flex-shrink:0;display:flex;align-items:center;">' +
                    '<span style="font-size:12.5px;color:#374151;font-weight:500;">' + m.label + '</span>' + infoIcon +
                '</div>' +
                // Progress bar
                '<div style="flex:1;height:8px;background:#f3f4f6;border-radius:20px;overflow:hidden;">' +
                    '<div style="height:100%;width:' + m.pct + '%;background:' + m.color + ';border-radius:20px;transition:width 0.8s cubic-bezier(0.4,0,0.2,1);"></div>' +
                '</div>' +
                // Pct
                '<div style="width:36px;text-align:right;flex-shrink:0;">' +
                    '<span style="font-size:12px;font-weight:600;color:' + (filled ? m.color : '#9ca3af') + ';">' + m.pct + '%</span>' +
                '</div>' +
                // Count
                '<div style="width:32px;flex-shrink:0;text-align:center;">' +
                    '<span style="display:inline-flex;align-items:center;justify-content:center;min-width:26px;height:22px;border-radius:20px;background:' + (m.count > 0 ? m.bg : '#f3f4f6') + ';color:' + (m.count > 0 ? m.dot : '#9ca3af') + ';font-size:12px;font-weight:700;padding:0 6px;">' + m.count + '</span>' +
                '</div>' +
            '</div>';
        }).join('');

        var panel = document.getElementById('delivery-report-panel');
        var backdrop = document.getElementById('delivery-report-backdrop');
        panel.style.display = 'flex';
        backdrop.style.display = 'block';
        setTimeout(function(){ panel.style.transform = 'translateX(0)'; }, 10);
    }
    function closeDeliveryReport() {
        var panel = document.getElementById('delivery-report-panel');
        var backdrop = document.getElementById('delivery-report-backdrop');
        panel.style.transform = 'translateX(100%)';
        backdrop.style.display = 'none';
        setTimeout(function(){ panel.style.display = 'none'; }, 300);
    }
    document.addEventListener('click', function(e) {
        var menu = document.getElementById('comm-action-menu');
        if (menu && !menu.contains(e.target) && e.target !== _commActionBtn) {
            menu.style.display = 'none';
            _commActionBtn = null;
        }
    });
    var _maActionBtn = null;
    function maActionToggle(btn, e) {
        e.stopPropagation();
        var menu = document.getElementById('ma-action-menu');
        if (_maActionBtn === btn && menu.style.display === 'block') {
            menu.style.display = 'none';
            _maActionBtn = null;
            return;
        }
        _maActionBtn = btn;
        var rect = btn.getBoundingClientRect();
        menu.style.display = 'block';
        // Position below button, right-aligned
        var menuW = 170;
        var left  = rect.right - menuW;
        if (left < 8) left = 8;
        menu.style.top  = (rect.bottom + 6) + 'px';
        menu.style.left = left + 'px';
    }
    function maActionDropdownClick(action) {
        var savedBtn = _maActionBtn;   // save before nulling
        document.getElementById('ma-action-menu').style.display = 'none';
        _maActionBtn = null;
        var row = savedBtn ? savedBtn.closest('tr') : null;
        var accountName = row ? row.querySelector('.ma-td-name').textContent : '';
        var accountId = row ? row.children[0].textContent.trim() : '';
        if (action === 'edit-details') {
            console.log('Edit Details clicked for account:', accountName);
        } else if (action === 'renewal') {
            console.log('Renewal clicked for account:', accountName);
        } else if (action === 'notif-settings') {
            if (window.acnOpenDrawer) acnOpenDrawer(accountId, accountName);
        }
    }
    document.addEventListener('click', function(e) {
        var menu = document.getElementById('ma-action-menu');
        if (menu && !menu.contains(e.target) && e.target !== _maActionBtn) {
            menu.style.display = 'none';
            _maActionBtn = null;
        }
    });
    function maFilterRows(q) {
        q = q.toLowerCase();
        var rows = document.querySelectorAll('#ma-table-body tr');
        var visible = 0;
        rows.forEach(function(tr) {
            if (tr.id === 'ma-no-results-row') return;
            var match = tr.textContent.toLowerCase().indexOf(q) !== -1;
            tr.style.display = match ? '' : 'none';
            if (match) visible++;
        });
        var noRes = document.getElementById('ma-no-results-row');
        if (noRes) noRes.style.display = (q && visible === 0) ? '' : 'none';
    }
    var _caNextId = 9000;
    function openCreateAccountModal() {
        document.getElementById('create-account-overlay').style.display = 'block';
        var modal = document.getElementById('create-account-modal');
        modal.style.display = 'flex';
        document.getElementById('ca-error').style.display = 'none';
        document.getElementById('ca-name').value = '';
        document.getElementById('ca-manager').value = '';
        document.getElementById('ca-name').focus();
    }
    function closeCreateAccountModal() {
        document.getElementById('create-account-overlay').style.display = 'none';
        document.getElementById('create-account-modal').style.display = 'none';
    }
    function submitCreateAccount() {
        var name = document.getElementById('ca-name').value.trim();
        var errEl = document.getElementById('ca-error');
        if (!name) {
            errEl.textContent = 'Account Name is required.';
            errEl.style.display = 'block';
            return;
        }
        var vertical = document.getElementById('ca-vertical').value;
        var pkg = document.getElementById('ca-package').value;
        var plan = document.getElementById('ca-plan').value;
        var manager = document.getElementById('ca-manager').value.trim() || '-';

        var tbody = document.getElementById('ma-table-body');
        var noRes = document.getElementById('ma-no-results-row');
        var tr = document.createElement('tr');

        function td(text, opts) {
            var cell = document.createElement('td');
            if (opts && opts.style) cell.style.cssText = opts.style;
            if (opts && opts.className) cell.className = opts.className;
            cell.textContent = text;
            return cell;
        }
        tr.appendChild(td(String(_caNextId++), { style: 'color:#6b7280' }));
        tr.appendChild(td(name, { className: 'ma-td-name' }));
        tr.appendChild(td(manager));
        tr.appendChild(td(vertical));
        tr.appendChild(td(pkg));
        tr.appendChild(td(plan));
        tr.appendChild(td('-'));
        var statusTd = document.createElement('td');
        var badge = document.createElement('span');
        badge.className = 'ma-status-badge';
        badge.textContent = 'Active';
        statusTd.appendChild(badge);
        tr.appendChild(statusTd);
        tr.appendChild(td('NA'));
        var actionTd = document.createElement('td');
        var actionBtn = document.createElement('button');
        actionBtn.className = 'ma-action-btn';
        actionBtn.innerHTML = '&#8943;';
        actionBtn.onclick = function(e) { maActionToggle(actionBtn, e); };
        actionTd.appendChild(actionBtn);
        tr.appendChild(actionTd);

        tbody.insertBefore(tr, noRes);
        closeCreateAccountModal();
    }
    window.closeCommLog = function closeCommLog() {
        document.getElementById('comm-log-overlay').style.display = 'none';
        if (_commLogObserver) { _commLogObserver.disconnect(); _commLogObserver = null; }
    };
    function commSwitchTab(tab) {
        ['communication','webhooks'].forEach(function(t) {
            var btn   = document.getElementById('comm-tab-' + t);
            var panel = document.getElementById('comm-panel-' + t);
            var active = t === tab;
            if (btn)   { btn.style.borderBottomColor = active ? '#2563eb' : 'transparent'; btn.style.color = active ? '#2563eb' : '#6b7280'; btn.style.fontWeight = active ? '600' : '400'; }
            if (panel) panel.style.display = active ? 'block' : 'none';
        });
    }
    // ── METS Balance loader ─────────────────────────────────────────────────────
    var _metsAuditAllLogs = [];
    var _smsByType = {};      // { committed: { domestic: 0, international: 0 }, ... }
    var _waByRegionCat = {}; // { committed: { '+91-India': { utility: 0, ... }, ... }, ... }

    function metsLoadBalances() {
        fetch(API_BASE + '/api/mets/balances')
            .then(function(r){ return r.json(); })
            .then(function(data) {
                // Update _revBalances from API data
                Object.keys(data).forEach(function(pool) {
                    if (!_revBalances[pool]) return;
                    _revBalances[pool].total = data[pool].total;
                    if (_revBalances[pool].channels && data[pool].channels) {
                        Object.keys(_revBalances[pool].channels).forEach(function(ch) {
                            _revBalances[pool].channels[ch] = data[pool].channels[ch] || 0;
                        });
                    }
                });
                mcInitRevPools();
                // Update dashboard card
                var CREDIT_POOLS = { complementary: true, testing: true };
                var total = 0, totalCredits = 0;
                Object.keys(data).forEach(function(p){
                    if (!data[p] || typeof data[p] !== 'object') return; // skip non-pool fields like _softHoldTotal
                    if (CREDIT_POOLS[p]) totalCredits += data[p].total || 0;
                    else total += data[p].total || 0;
                });
                // Add soft-held METS — still owned by the account (will be consumed or returned)
                total += data._softHoldTotal || 0;
                var fmt = function(n){ return Math.round(n).toLocaleString('en-IN'); };
                var el;
                el = document.getElementById('mets-total-val');         if(el) el.textContent = fmt(total);
                el = document.getElementById('mets-committed-val');     if(el) el.textContent = fmt(data.committed     ? data.committed.total     : 0);
                el = document.getElementById('mets-allocated-val');     if(el) el.textContent = fmt(data.allocated     ? data.allocated.total     : 0);
                el = document.getElementById('mets-unallocated-val');   if(el) el.textContent = fmt(data.unallocated   ? data.unallocated.total   : 0);
                el = document.getElementById('mets-credits-comp-val');  if(el) el.textContent = fmt(data.complementary ? data.complementary.total : 0);
                el = document.getElementById('mets-credits-test-val');  if(el) el.textContent = fmt(data.testing       ? data.testing.total       : 0);
                el = document.getElementById('mets-softhold-val');      if(el) el.textContent = fmt(data._softHoldTotal || 0);
                // Also load per-type SMS and WA region balances for the allocation table
                var p1 = fetch(API_BASE + '/api/mets/sms-type-balances')
                    .then(function(r){ return r.json(); })
                    .then(function(rows){
                        _smsByType = {};
                        rows.forEach(function(row){
                            var pool = row.pool || 'committed';
                            if (!_smsByType[pool]) _smsByType[pool] = {};
                            _smsByType[pool][row.sms_type] = row.balance || 0;
                        });
                    })
                    .catch(function(){});
                var p2 = fetch(API_BASE + '/api/mets/wa-region-balances')
                    .then(function(r){ return r.json(); })
                    .then(function(rows){
                        _waByRegionCat = {};
                        rows.forEach(function(row){
                            var pool = row.pool || 'committed';
                            var region = row.region || '';
                            var cat = (row.category || '').toLowerCase();
                            if (!_waByRegionCat[pool]) _waByRegionCat[pool] = {};
                            if (!_waByRegionCat[pool][region]) _waByRegionCat[pool][region] = {};
                            _waByRegionCat[pool][region][cat] = row.balance || 0;
                        });
                    })
                    .catch(function(){});
                Promise.all([p1, p2]).then(function(){ metsRenderAlloc(); }).catch(function(){ metsRenderAlloc(); });
            })
            .catch(function(){});
    }

    var _stmtAllRows  = [];
    var _stmtPage     = 0;
    var _stmtPageSize = 10;
    var _stmtShowAll  = false;

    function metsLoadStatement() {
        var tbody = document.getElementById('stmt-tbody');
        if (!tbody) return;
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:#9ca3af;font-size:13px;">Loading\u2026</td></tr>';
        _stmtPage    = 0;
        _stmtShowAll = false;
        fetch(API_BASE + '/api/mets/statement')
            .then(function(r){ return r.json(); })
            .then(function(rows) {
                _stmtAllRows = rows;
                metsRenderStmtPage();
            })
            .catch(function() {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:#ef4444;font-size:13px;">Failed to load statement.</td></tr>';
            });
    }

    function metsRenderStmtPage() {
        var tbody = document.getElementById('stmt-tbody');
        if (!tbody) return;
        var rows = _stmtAllRows;
        if (!rows.length) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:40px;color:#9ca3af;font-size:13px;">No transactions found.</td></tr>';
            return;
        }

        // Pagination slice
        var pageRows = _stmtShowAll ? rows : rows.slice(_stmtPage * _stmtPageSize, (_stmtPage + 1) * _stmtPageSize);

        var fmtSplit = function(n) {
            if (n === null || n === undefined) return '<span class="stmt-dash">-</span>';
            var abs = Math.abs(Number(n));
            var str = abs.toLocaleString('en-IN', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
            var dot = str.indexOf('.');
            var intPart = dot !== -1 ? str.slice(0, dot) : str;
            var decPart = dot !== -1 ? str.slice(dot) : '';
            var sign = n < 0 ? '-' : '';
            return sign + '<span class="stmt-num-int">' + intPart + '</span><span class="stmt-num-dec">' + decPart + '</span>';
        };

        var fmtDate = function(ts) {
            var d = new Date(ts * 1000);
            var day  = String(d.getDate()).padStart(2,'0');
            var mon  = String(d.getMonth()+1).padStart(2,'0');
            var yr   = d.getFullYear();
            var h    = d.getHours();
            var m    = String(d.getMinutes()).padStart(2,'0');
            var ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12 || 12;
            return day + '/' + mon + '/' + yr + ', ' + String(h).padStart(2,'0') + ':' + m + ' ' + ampm;
        };

        var infoIcon = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left:5px;vertical-align:middle;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';

        var html = '';
        pageRows.forEach(function(r) {
            var isCredit = r.txType === 'Credited';
            var netNeg   = r.net < 0;
            var badge    = isCredit
                ? '<span class="stmt-badge stmt-badge-credit">Addition</span>'
                : '<span class="stmt-badge stmt-badge-debit">Deduction</span>';
            html += '<tr>'
                + '<td class="stmt-date">' + fmtDate(r.ts) + '</td>'
                + '<td>' + badge + '</td>'
                + '<td style="color:#475569;font-size:12.5px;">' + (r.classification || '<span class="stmt-dash">-</span>') + '</td>'
                + '<td style="color:#475569;font-size:12.5px;">' + (r.feature || '<span class="stmt-dash">-</span>') + '</td>'
                + '<td style="text-align:center;">' + (r.credited !== null ? fmtSplit(r.credited) + infoIcon : '<span class="stmt-dash">-</span>') + '</td>'
                + '<td style="text-align:center;">' + (r.debited  !== null ? fmtSplit(r.debited)             : '<span class="stmt-dash">-</span>') + '</td>'
                + '<td style="text-align:center;">' + fmtSplit(r.opening) + '</td>'
                + '<td style="text-align:center;" class="' + (netNeg ? 'stmt-net-neg' : '') + '">' + fmtSplit(r.net) + '</td>'
                + '</tr>';
        });
        tbody.innerHTML = html;

        // Update footer
        var totalBtn = document.getElementById('stmt-total-btn');
        if (totalBtn) totalBtn.textContent = 'Total Records: ' + rows.length;
    }

    function metsStmtNextPage() {
        var maxPage = Math.ceil(_stmtAllRows.length / _stmtPageSize) - 1;
        if (_stmtPage < maxPage) { _stmtPage++; metsRenderStmtPage(); }
    }
    function metsStmtPrevPage() {
        if (_stmtPage > 0) { _stmtPage--; metsRenderStmtPage(); }
    }
    function metsStmtChangePageSize() {
        var sel = document.getElementById('stmt-page-size');
        _stmtPageSize = parseInt(sel ? sel.value : 10) || 10;
        _stmtPage     = 0;
        _stmtShowAll  = false;
        metsRenderStmtPage();
    }
    function metsStmtShowAll() {
        _stmtShowAll = !_stmtShowAll;
        metsRenderStmtPage();
    }

    // ── Complementary Report ──────────────────────────────────────────────────
    var _compAllRows  = [];
    var _compPage     = 0;
    var _compPageSize = 10;
    var _compShowAll  = false;

    function compLoadReport() {
        var tbody = document.getElementById('comp-tbody');
        if (!tbody) return;
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:#9ca3af;font-size:13px;">Loading\u2026</td></tr>';
        fetch(API_BASE + '/api/mets/complementary-report')
            .then(function(r){ return r.json(); })
            .then(function(rows) {
                _compAllRows  = rows;
                _compPage     = 0;
                _compShowAll  = false;
                compRenderPage();
            })
            .catch(function() {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:#ef4444;font-size:13px;">Failed to load.</td></tr>';
            });
    }

    function compRenderPage() {
        var tbody = document.getElementById('comp-tbody');
        if (!tbody) return;

        var rows = _compAllRows;
        var total = rows.length;

        var slice = _compShowAll ? rows : rows.slice(_compPage * _compPageSize, (_compPage + 1) * _compPageSize);

        var fmtSplit = function(n) {
            if (n == null) return '<span class="stmt-dash">-</span>';
            var abs = Math.abs(n);
            var sign = n < 0 ? '-' : '';
            var str  = abs.toLocaleString('en-IN', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
            var dotIdx = str.lastIndexOf('.');
            var intPart = dotIdx !== -1 ? str.slice(0, dotIdx) : str;
            var decPart = dotIdx !== -1 ? str.slice(dotIdx) : '.000';
            return sign + '<span class="stmt-num-int">' + intPart + '</span><span class="stmt-num-dec">' + decPart + '</span>';
        };

        if (!slice.length) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:#9ca3af;font-size:13px;">No complementary transactions found.</td></tr>';
        } else {
            var html = '';
            slice.forEach(function(r) {
                var isCredit = r.txType === 'Credited';
                var netNeg   = r.net < 0;
                var badge    = isCredit
                    ? '<span class="stmt-badge stmt-badge-credit">Addition</span>'
                    : '<span class="stmt-badge stmt-badge-debit">Deduction</span>';
                var d  = new Date(r.ts * 1000);
                var ts = d.toLocaleDateString('en-GB') + ', ' + d.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12:true });
                html += '<tr>'
                    + '<td class="stmt-date">' + ts + '</td>'
                    + '<td>' + badge + '</td>'
                    + '<td>' + (r.feature || '-') + '</td>'
                    + '<td style="text-align:center;">' + fmtSplit(r.credited) + '</td>'
                    + '<td style="text-align:center;">' + fmtSplit(r.debited)  + '</td>'
                    + '<td style="text-align:center;">' + fmtSplit(r.opening)  + '</td>'
                    + '<td style="text-align:center;" class="' + (netNeg ? 'stmt-net-neg' : '') + '">' + fmtSplit(r.net) + '</td>'
                    + '</tr>';
            });
            tbody.innerHTML = html;
        }

        var totalBtn = document.getElementById('comp-total-btn');
        if (totalBtn) {
            totalBtn.textContent = _compShowAll ? 'Show Paginated' : 'Total Records: ' + total;
        }

        var maxPage = Math.ceil(total / _compPageSize) - 1;
        var prevBtn = tbody.closest('.mets-tab-content') ? tbody.closest('#mets-panel-comp').querySelector('.stmt-nav-btn') : null;
    }

    function compNextPage() {
        var maxPage = Math.ceil(_compAllRows.length / _compPageSize) - 1;
        if (_compPage < maxPage) { _compPage++; compRenderPage(); }
    }
    function compPrevPage() {
        if (_compPage > 0) { _compPage--; compRenderPage(); }
    }
    function compChangePageSize() {
        var sel = document.getElementById('comp-page-size');
        if (sel) { _compPageSize = parseInt(sel.value) || 10; _compPage = 0; compRenderPage(); }
    }
    function compShowAll() {
        _compShowAll = !_compShowAll;
        compRenderPage();
    }

    // ── Testing Credits Report ────────────────────────────────────────────────
    var _testRptAllRows  = [];
    var _testRptPage     = 0;
    var _testRptPageSize = 10;
    var _testRptShowAll  = false;

    function testingReportLoad() {
        var tbody = document.getElementById('testing-report-tbody');
        if (!tbody) return;
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:#9ca3af;font-size:13px;">Loading\u2026</td></tr>';
        fetch(API_BASE + '/api/mets/testing-report')
            .then(function(r){ return r.json(); })
            .then(function(rows) {
                _testRptAllRows  = rows;
                _testRptPage     = 0;
                _testRptShowAll  = false;
                testingReportRenderPage();
            })
            .catch(function() {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:#ef4444;font-size:13px;">Failed to load.</td></tr>';
            });
    }

    function testingReportRenderPage() {
        var tbody = document.getElementById('testing-report-tbody');
        if (!tbody) return;
        var rows  = _testRptAllRows;
        var total = rows.length;
        var slice = _testRptShowAll ? rows : rows.slice(_testRptPage * _testRptPageSize, (_testRptPage + 1) * _testRptPageSize);

        var fmtSplit = function(n) {
            if (n == null) return '<span class="stmt-dash">-</span>';
            var abs = Math.abs(n);
            var sign = n < 0 ? '-' : '';
            var str  = abs.toLocaleString('en-IN', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
            var dotIdx = str.lastIndexOf('.');
            var intPart = dotIdx !== -1 ? str.slice(0, dotIdx) : str;
            var decPart = dotIdx !== -1 ? str.slice(dotIdx) : '.000';
            return sign + '<span class="stmt-num-int">' + intPart + '</span><span class="stmt-num-dec">' + decPart + '</span>';
        };

        if (!slice.length) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:#9ca3af;font-size:13px;">No testing credit transactions found.</td></tr>';
        } else {
            var html = '';
            slice.forEach(function(r) {
                var isCredit = r.txType === 'Credited';
                var netNeg   = r.net < 0;
                var badge    = isCredit
                    ? '<span class="stmt-badge stmt-badge-credit">Addition</span>'
                    : '<span class="stmt-badge stmt-badge-debit">Deduction</span>';
                var d  = new Date(r.ts * 1000);
                var ts = d.toLocaleDateString('en-GB') + ', ' + d.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12:true });
                html += '<tr>'
                    + '<td class="stmt-date">' + ts + '</td>'
                    + '<td>' + badge + '</td>'
                    + '<td>' + (r.feature || '-') + '</td>'
                    + '<td style="text-align:center;">' + fmtSplit(r.credited) + '</td>'
                    + '<td style="text-align:center;">' + fmtSplit(r.debited)  + '</td>'
                    + '<td style="text-align:center;">' + fmtSplit(r.opening)  + '</td>'
                    + '<td style="text-align:center;" class="' + (netNeg ? 'stmt-net-neg' : '') + '">' + fmtSplit(r.net) + '</td>'
                    + '</tr>';
            });
            tbody.innerHTML = html;
        }

        var totalBtn = document.getElementById('testing-report-total-btn');
        if (totalBtn) totalBtn.textContent = _testRptShowAll ? 'Show Paginated' : 'Total Records: ' + total;
    }

    function testingReportNextPage() {
        var max = Math.ceil(_testRptAllRows.length / _testRptPageSize) - 1;
        if (_testRptPage < max) { _testRptPage++; testingReportRenderPage(); }
    }
    function testingReportPrevPage() {
        if (_testRptPage > 0) { _testRptPage--; testingReportRenderPage(); }
    }
    function testingReportChangePageSize() {
        var sel = document.getElementById('testing-report-page-size');
        if (sel) { _testRptPageSize = parseInt(sel.value) || 10; _testRptPage = 0; testingReportRenderPage(); }
    }
    function testingReportShowAll() {
        _testRptShowAll = !_testRptShowAll;
        testingReportRenderPage();
    }

    // ── View Usage Report ─────────────────────────────────────────────────────
    var _usageAllRows  = [];
    var _usagePage     = 0;
    var _usagePageSize = 10;
    var _usageShowAll  = false;

    function usageLoadReport() {
        var tbody = document.getElementById('usage-tbody');
        if (!tbody) return;
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:40px;color:#9ca3af;font-size:13px;">Loading\u2026</td></tr>';
        fetch(API_BASE + '/api/mets/usage')
            .then(function(r){ return r.json(); })
            .then(function(rows) {
                _usageAllRows  = rows;
                _usagePage     = 0;
                _usageShowAll  = false;
                usageRenderPage();
            })
            .catch(function() {
                tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:40px;color:#ef4444;font-size:13px;">Failed to load.</td></tr>';
            });
    }

    function usageRenderPage() {
        var tbody = document.getElementById('usage-tbody');
        if (!tbody) return;

        var rows  = _usageAllRows;
        var total = rows.length;
        var slice = _usageShowAll ? rows : rows.slice(_usagePage * _usagePageSize, (_usagePage + 1) * _usagePageSize);

        var fmtSplit = function(n) {
            if (n == null) return '<span class="stmt-dash">-</span>';
            var abs = Math.abs(n);
            var sign = n < 0 ? '-' : '';
            var str  = abs.toLocaleString('en-IN', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
            var dotIdx = str.lastIndexOf('.');
            var intPart = dotIdx !== -1 ? str.slice(0, dotIdx) : str;
            var decPart = dotIdx !== -1 ? str.slice(dotIdx) : '.000';
            return sign + '<span class="stmt-num-int">' + intPart + '</span><span class="stmt-num-dec">' + decPart + '</span>';
        };

        if (!slice.length) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:40px;color:#9ca3af;font-size:13px;">No usage records found.</td></tr>';
        } else {
            var html = '';
            slice.forEach(function(r) {
                var d  = new Date(r.ts * 1000);
                var ts = d.toLocaleDateString('en-GB', { day:'2-digit', month:'2-digit', year:'numeric' })
                       + ', ' + d.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12:true });
                html += '<tr>'
                    + '<td class="stmt-date">' + ts + '</td>'
                    + '<td>' + (r.channel || '-') + '</td>'
                    + '<td>' + (r.type || '-') + '</td>'
                    + '<td>' + (r.templateType || '-') + '</td>'
                    + '<td style="text-align:center;">' + fmtSplit(r.sentCount) + '</td>'
                    + '<td style="text-align:center;">' + fmtSplit(r.cpmcps) + '</td>'
                    + '<td style="text-align:center;">' + fmtSplit(r.metsUsed) + '</td>'
                    + '<td style="text-align:center;">' + fmtSplit(r.compCredits) + '</td>'
                    + '<td style="text-align:center;">' + fmtSplit(r.testingCredits) + '</td>'
                    + '</tr>';
            });
            tbody.innerHTML = html;
        }

        var totalBtn = document.getElementById('usage-total-btn');
        if (totalBtn) totalBtn.textContent = _usageShowAll ? 'Show Paginated' : 'Total Records: ' + total;
    }

    function usageNextPage() {
        var max = Math.ceil(_usageAllRows.length / _usagePageSize) - 1;
        if (_usagePage < max) { _usagePage++; usageRenderPage(); }
    }
    function usagePrevPage() {
        if (_usagePage > 0) { _usagePage--; usageRenderPage(); }
    }
    function usageChangePageSize() {
        var sel = document.getElementById('usage-page-size');
        if (sel) { _usagePageSize = parseInt(sel.value) || 10; _usagePage = 0; usageRenderPage(); }
    }
    function usageShowAll() {
        _usageShowAll = !_usageShowAll;
        usageRenderPage();
    }

    // Expose usage functions globally so onclick handlers and pingback callbacks can reach them
    window.usageLoadReport     = usageLoadReport;
    window.usageRenderPage     = usageRenderPage;
    window.usageNextPage       = usageNextPage;
    window.usagePrevPage       = usagePrevPage;
    window.usageChangePageSize = usageChangePageSize;
    window.usageShowAll        = usageShowAll;

    function metsLoadAudit() {
        var container = document.getElementById('mets-audit-timeline');
        if (!container) return;
        container.innerHTML = '<div style="padding:40px;text-align:center;color:#9ca3af;font-size:13px;">Loading\u2026</div>';
        fetch(API_BASE + '/api/mets/audit-logs')
            .then(function(r){ return r.json(); })
            .then(function(logs) {
                _metsAuditAllLogs = logs;
                var cnt = document.getElementById('audit-count');
                if(cnt) cnt.textContent = logs.length + (logs.length === 1 ? ' entry' : ' entries');
                metsRenderAudit(logs);
            })
            .catch(function() {
                container.innerHTML = '<div style="padding:40px;text-align:center;color:#ef4444;font-size:13px;">Failed to load logs.</div>';
            });
    }

    function metsFilterAudit() {
        var actionFilter  = (document.getElementById('audit-filter-action') ||{}).value || '';
        var featureFilter = (document.getElementById('audit-filter-feature')||{}).value || '';
        var filtered = _metsAuditAllLogs.filter(function(l){
            var matchA = !actionFilter || l.action === actionFilter
                || (actionFilter === 'METS Deduction' && l.action === 'METS Reversal');
            var matchF = !featureFilter || (l.description || '').toLowerCase().indexOf(featureFilter.toLowerCase()) !== -1
                || (l.details || '').toLowerCase().indexOf(featureFilter.toLowerCase()) !== -1;
            return matchA && matchF;
        });
        metsRenderAudit(filtered);
    }

    function metsRenderAudit(logs) {
        var container = document.getElementById('mets-audit-timeline');
        if (!container) return;
        if (!logs || !logs.length) {
            container.innerHTML = '<div style="padding:60px;text-align:center;color:#9ca3af;font-size:13px;">No audit logs found.</div>';
            return;
        }
        var html = '<div class="al-timeline">';
        logs.forEach(function(l, i) {
            var d = new Date(l.ts * 1000);
            var timeStr = d.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) + ', ' + d.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
            var isTopup = l.action === 'METS Top-up' || l.action === 'Complementary Credits';
            var dotColor = isTopup ? '#059669' : (l.action === 'METS Deduction' || l.action === 'METS Reversal' ? '#ef4444' : '#2563eb');
            html += '<div class="al-item">'
                + '<div class="al-left">'
                +   '<div class="al-dot" style="background:' + dotColor + ';"></div>'
                +   (i < logs.length-1 ? '<div class="al-connector"></div>' : '')
                + '</div>'
                + '<div class="al-body">'
                +   '<div class="al-time">' + timeStr + '</div>'
                +   '<div class="al-user">' + (l.user_name||'Hemant Bhadoria') + ' \u00b7 ' + (l.department||'Admin') + '</div>'
                +   '<div class="al-desc">' + (l.description || l.details || '') + '</div>'
                + '</div>'
                + '</div>';
        });
        html += '</div>';
        container.innerHTML = html;
    }

    function metsClearAudit() {
        if (!confirm('Clear all audit logs? This cannot be undone.')) return;
        fetch(API_BASE + '/api/mets/audit-logs', {method:'DELETE'})
            .then(function(){
                _metsAuditAllLogs = [];
                metsRenderAudit([]);
                var cnt = document.getElementById('audit-count');
                if(cnt) cnt.textContent = '0 entries';
            });
    }


    function metsSelectPlan(group, plan) {
        document.querySelectorAll('tr[data-group="' + group + '"]').forEach(function(row) {
            var isSelected = row.getAttribute('data-plan') === plan;
            // Radio button — re-add active to trigger pulse animation
            var radio = row.querySelector('.mets-radio');
            if (radio) {
                radio.classList.remove('active');
                if (isSelected) { void radio.offsetWidth; radio.classList.add('active'); }
            }
            // Row selected class — drives val-on/val-off via CSS
            row.classList.toggle('mets-row-selected', isSelected);
            // Plan label colour
            var planCell = row.querySelector('.mets-plan-cell');
            if (planCell) planCell.classList.toggle('mets-plan-label--selected', isSelected);
        });
    }

    function metsSwitchTab(el, panelId) {
        // Update tabs
        el.closest('.mets-tabs-row').querySelectorAll('.mets-tab').forEach(function(t){ t.classList.remove('active'); });
        el.classList.add('active');
        // Update panels
        ['mets-panel-alloc','mets-panel-addon','mets-panel-stmt','mets-panel-usage','mets-panel-comp','mets-panel-testing-report','mets-panel-audit'].forEach(function(id){
            var p = document.getElementById(id);
            if (p) p.style.display = (id === panelId) ? 'block' : 'none';
        });
        if (panelId === 'mets-panel-audit') { setTimeout(metsLoadAudit, 0); }
    }

    // ── Consumption Pop-up ──────────────────────────────────────────────────────
    var _consumptionJobId        = null;
    var _consumptionMaxCred      = 0;   // max available credits for the selected feature
    var _consumptionActiveNewStep = 'form'; // tracks which new-request step is visible: 'form'|'result'|'done'

    function openConsumptionPopup() {
        _consumptionJobId        = null;
        _consumptionMaxCred      = 0;
        _consumptionActiveNewStep = 'form';
        // Reset tabs — always open on "New Request"
        var newBtn  = document.getElementById('ctab-new');
        var pendBtn = document.getElementById('ctab-pending');
        if (newBtn)  { newBtn.style.color  = '#2563eb'; newBtn.style.fontWeight  = '600'; newBtn.style.borderBottom  = '2.5px solid #2563eb'; }
        if (pendBtn) { pendBtn.style.color = '#6b7280'; pendBtn.style.fontWeight = '500'; pendBtn.style.borderBottom = '2.5px solid transparent'; }
        document.getElementById('consumption-step-form').style.display    = 'block';
        document.getElementById('consumption-step-result').style.display  = 'none';
        document.getElementById('consumption-step-done').style.display    = 'none';
        document.getElementById('consumption-step-pending').style.display = 'none';
        document.getElementById('consumption-modal-title').textContent = 'New Consumption Request';
        document.getElementById('consumption-modal-sub').textContent   = 'Select a feature to see available credits';
        // Clear form
        document.getElementById('consumption-feature').value = '';
        document.getElementById('consumption-sms-opts').style.display   = 'none';
        document.getElementById('consumption-wa-opts').style.display    = 'none';
        document.getElementById('consumption-credits-avail').style.display = 'none';
        var credIn = document.getElementById('consumption-credits');
        credIn.value = ''; credIn.disabled = true; credIn.placeholder = 'Select a feature first…';
        credIn.style.background = '#f9fafb';
        document.getElementById('consumption-max-btn').style.display = 'none';
        var errEl = document.getElementById('consumption-error');
        if (errEl) { errEl.style.display = 'none'; errEl.textContent = ''; }
        document.getElementById('consumption-overlay').style.display = 'flex';
        document.getElementById('consumption-modal').style.display   = 'flex';
        // Load pending badge in background
        _loadPendingPingbacksBadge();
    }

    function closeConsumptionPopup() {
        document.getElementById('consumption-overlay').style.display = 'none';
        document.getElementById('consumption-modal').style.display   = 'none';
        if (_consumptionJobId) metsLoadBalances();
    }

    function consumptionFeatureChange() {
        var feat = document.getElementById('consumption-feature').value;
        document.getElementById('consumption-sms-opts').style.display = feat === 'SMS'      ? 'block' : 'none';
        document.getElementById('consumption-wa-opts').style.display  = feat === 'WhatsApp' ? 'block' : 'none';
        // Reset credits input
        var credIn = document.getElementById('consumption-credits');
        credIn.value = ''; credIn.disabled = true; credIn.placeholder = 'Calculating credits…';
        document.getElementById('consumption-max-btn').style.display = 'none';
        document.getElementById('consumption-credits-avail').style.display = feat ? 'block' : 'none';
        if (feat) _fetchConsumptionCredits();
    }

    function consumptionSubOptionChange() {
        var credIn = document.getElementById('consumption-credits');
        credIn.value = ''; credIn.disabled = true; credIn.placeholder = 'Calculating credits…';
        document.getElementById('consumption-max-btn').style.display = 'none';
        _fetchConsumptionCredits();
    }

    function _fetchConsumptionCredits() {
        var feat    = document.getElementById('consumption-feature').value;
        if (!feat) return;
        var params  = 'feature=' + encodeURIComponent(feat);
        if (feat === 'SMS') {
            var smsT = document.querySelector('input[name="consumption-sms-type"]:checked');
            if (smsT) params += '&smsType=' + smsT.value;
        }
        if (feat === 'WhatsApp') {
            var cat = document.getElementById('consumption-wa-category').value;
            if (cat) params += '&category=' + encodeURIComponent(cat);
        }
        var loadEl = document.getElementById('consumption-avail-loading');
        if (loadEl) { loadEl.textContent = 'Calculating…'; loadEl.style.color = '#6b7280'; }

        fetch(API_BASE + '/api/mets/available-credits?' + params)
            .then(function(r){ return r.json(); })
            .then(function(d) {
                if (d.error) {
                    if (loadEl) { loadEl.textContent = 'Error'; loadEl.style.color = '#dc2626'; }
                    return;
                }
                _consumptionMaxCred = d.credits.total || 0;
                var fmt = function(n){ return Number(n).toLocaleString('en-IN'); };

                // Build available credits breakdown rows
                var poolCfg = [
                    { key:'testing',       label:'Testing Credits',       color:'#7c3aed', credKey:'testing' },
                    { key:'complementary', label:'Complementary Credits', color:'#2563eb', credKey:'complementary' },
                    { key:'mets',          label:'METS (Committed + Unallocated)', color:'#0d9488', credKey:'mets' },
                ];
                var bodyHtml = poolCfg.map(function(p, idx, arr) {
                    var val = d.credits[p.credKey] || 0;
                    var border = idx < arr.length - 1 ? 'border-bottom:1px solid #dbeafe;' : '';
                    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 14px;' + border + '">'
                        + '<div style="display:flex;align-items:center;gap:7px;">'
                        +   '<div style="width:7px;height:7px;border-radius:50%;background:' + p.color + ';flex-shrink:0;"></div>'
                        +   '<span style="font-size:12px;color:#374151;">' + p.label + '</span>'
                        + '</div>'
                        + '<span style="font-size:12.5px;font-weight:700;color:' + (val > 0 ? '#111827' : '#9ca3af') + ';">'
                        +   fmt(val) + (p.key === 'mets' && d.rate > 0 ? ' <span style="font-size:10.5px;font-weight:400;color:#9ca3af;">(at ' + fmt(d.rate) + ' ' + (d.pricing_field && d.pricing_field.indexOf('CPM') !== -1 ? 'CPM' : 'CPS') + ')</span>' : '')
                        + '</span>'
                        + '</div>';
                }).join('');
                document.getElementById('consumption-avail-body').innerHTML = bodyHtml;

                // Update total label
                if (loadEl) {
                    loadEl.innerHTML = '<span style="font-size:13px;font-weight:800;color:#1d4ed8;">' + fmt(_consumptionMaxCred) + '</span> <span style="font-size:11px;color:#3b82f6;">credits available</span>';
                }

                // Enable input
                var credIn = document.getElementById('consumption-credits');
                credIn.disabled = _consumptionMaxCred <= 0;
                credIn.style.background = _consumptionMaxCred > 0 ? '#fff' : '#f9fafb';
                credIn.placeholder = _consumptionMaxCred > 0 ? 'Enter credits to hold…' : 'No credits available';
                credIn.max = _consumptionMaxCred;
                document.getElementById('consumption-max-btn').style.display = _consumptionMaxCred > 0 ? 'inline-block' : 'none';
            })
            .catch(function() {
                if (loadEl) { loadEl.textContent = 'Failed to load'; loadEl.style.color = '#dc2626'; }
            });
    }

    function consumptionSetMax() {
        var credIn = document.getElementById('consumption-credits');
        if (_consumptionMaxCred > 0) {
            credIn.value = _consumptionMaxCred;
            credIn.focus();
        }
    }

    function consumptionSubmit(btn) {
        var feature = document.getElementById('consumption-feature').value;
        var credits = parseFloat(document.getElementById('consumption-credits').value);
        var errEl   = document.getElementById('consumption-error');

        if (!feature) { errEl.textContent = 'Please select a feature.'; errEl.style.display = 'block'; return; }
        if (!credits || credits <= 0 || isNaN(credits)) { errEl.textContent = 'Please enter a valid number of credits.'; errEl.style.display = 'block'; return; }
        if (credits > _consumptionMaxCred && _consumptionMaxCred > 0) { errEl.textContent = 'Cannot exceed available credits (' + Number(_consumptionMaxCred).toLocaleString('en-IN') + ').'; errEl.style.display = 'block'; return; }

        errEl.style.display = 'none';

        var body = { feature: feature, credits: credits };
        if (feature === 'SMS') {
            var smsType = document.querySelector('input[name="consumption-sms-type"]:checked');
            if (smsType) body.smsType = smsType.value;
        }
        if (feature === 'WhatsApp') {
            var waRegion = document.getElementById('consumption-wa-region').value.trim();
            var waCat    = document.getElementById('consumption-wa-category').value;
            if (waRegion) body.region = waRegion;
            if (waCat)    body.category = waCat;
        }

        btn.disabled = true;
        btn.innerHTML = '⏳ Processing…';

        fetch(API_BASE + '/api/mets/consume', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
        .then(function(r){ return r.json(); })
        .then(function(data) {
            btn.disabled = false;
            btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Initiate Soft Hold';
            if (data.error) { errEl.textContent = data.error; errEl.style.display = 'block'; return; }
            _consumptionJobId = data.job_id;
            _consumptionShowResult(data);
        })
        .catch(function() {
            btn.disabled = false;
            btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Initiate Soft Hold';
            errEl.textContent = 'Network error. Please try again.';
            errEl.style.display = 'block';
        });
    }

    function _consumptionShowResult(data) {
        var fmt = function(n){ return Number(n).toLocaleString('en-IN'); };
        document.getElementById('consumption-modal-title').textContent  = 'Consumption Initiated';
        document.getElementById('consumption-modal-sub').textContent    = 'Credits reserved under Job ID ' + data.job_id;
        document.getElementById('consumption-result-jobid').textContent = data.job_id;
        document.getElementById('consumption-result-credits').textContent = fmt(data.credits_held) + (data.partial ? ' (partial)' : '');
        document.getElementById('consumption-result-held').textContent    = fmt(data.mets_held) + ' METS';

        // Build source breakdown showing credits + METS per source
        var poolLabels = { testing:'Testing Credits', complementary:'Complementary Credits', committed:'Committed METS', unallocated:'Unallocated METS' };
        var poolColors = { testing:'#7c3aed', complementary:'#2563eb', committed:'#0d9488', unallocated:'#6b7280' };
        var breakdown  = data.source_breakdown || {};
        var bdHtml = Object.entries(breakdown).map(function(entry, idx, arr) {
            var pool = entry[0];
            var v    = entry[1];
            var cred = typeof v === 'object' ? (v.credits || 0) : v;
            var mets = typeof v === 'object' ? (v.mets    || 0) : v;
            var label = poolLabels[pool] || (pool.charAt(0).toUpperCase() + pool.slice(1));
            var color = poolColors[pool] || '#374151';
            var border = idx < arr.length - 1 ? 'border-bottom:1px solid #f0f2f7;' : '';
            var metsNote = (pool === 'committed' || pool === 'unallocated') ? ' <span style="font-size:11px;color:#9ca3af;">(' + fmt(mets) + ' METS)</span>' : '';
            return '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;' + border + '">'
                + '<div style="display:flex;align-items:center;gap:8px;">'
                +   '<div style="width:8px;height:8px;border-radius:50%;background:' + color + ';flex-shrink:0;"></div>'
                +   '<span style="font-size:12.5px;color:#374151;">' + label + '</span>'
                + '</div>'
                + '<span style="font-size:13px;font-weight:700;color:#111827;">' + fmt(cred) + ' credits' + metsNote + '</span>'
                + '</div>';
        }).join('');
        document.getElementById('consumption-result-breakdown').innerHTML = bdHtml || '<div style="padding:12px 14px;font-size:12.5px;color:#9ca3af;">No breakdown available</div>';

        _consumptionActiveNewStep = 'result';
        document.getElementById('consumption-step-form').style.display    = 'none';
        document.getElementById('consumption-step-result').style.display  = 'block';
        document.getElementById('consumption-step-done').style.display    = 'none';
        document.getElementById('consumption-step-pending').style.display = 'none';
        // Switch to New Request tab in case user was on Pending tab
        var newBtn  = document.getElementById('ctab-new');
        var pendBtn = document.getElementById('ctab-pending');
        if (newBtn)  { newBtn.style.color  = '#2563eb'; newBtn.style.fontWeight  = '600'; newBtn.style.borderBottom  = '2.5px solid #2563eb'; }
        if (pendBtn) { pendBtn.style.color = '#6b7280'; pendBtn.style.fontWeight = '500'; pendBtn.style.borderBottom = '2.5px solid transparent'; }
        // Refresh pending badge to reflect new held row
        _loadPendingPingbacksBadge();
    }

    function consumptionPingback(status, btn) {
        if (!_consumptionJobId) return;
        var sbBtn = document.getElementById('pingback-success-btn');
        var fbBtn = document.getElementById('pingback-failure-btn');
        if (sbBtn) sbBtn.disabled = true;
        if (fbBtn) fbBtn.disabled = true;

        fetch(API_BASE + '/api/mets/pingback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ job_id: _consumptionJobId, status: status }),
        })
        .then(function(r){ return r.json(); })
        .then(function(data) {
            var isSuccess  = (status === 'success');
            var iconBg     = isSuccess ? '#dcfce7' : '#fee2e2';
            var iconStroke = isSuccess ? '#16a34a' : '#ef4444';
            var iconPath   = isSuccess
                ? '<polyline points="20 6 9 17 4 12"/>'
                : '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';
            document.getElementById('consumption-done-icon').style.background = iconBg;
            document.getElementById('consumption-done-icon').innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' + iconStroke + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' + iconPath + '</svg>';
            document.getElementById('consumption-done-title').textContent = isSuccess ? 'Credits Consumed' : 'Credits Released';
            document.getElementById('consumption-done-msg').textContent   = data.message || (isSuccess ? 'Credits permanently consumed.' : 'Credits returned to source pools.');
            _consumptionActiveNewStep = 'done';
            document.getElementById('consumption-step-result').style.display  = 'none';
            document.getElementById('consumption-step-done').style.display    = 'block';
            document.getElementById('consumption-step-pending').style.display = 'none';
            metsLoadBalances();
            _loadPendingPingbacksBadge();
            if (isSuccess) {
                usageLoadReport();
            }
        })
        .catch(function() {
            if (sbBtn) sbBtn.disabled = false;
            if (fbBtn) fbBtn.disabled = false;
        });
    }

    // ── Tab switching ──────────────────────────────────────────────────────────
    function consumptionSwitchTab(tab) {
        var isNew   = (tab === 'new');
        var newBtn  = document.getElementById('ctab-new');
        var pendBtn = document.getElementById('ctab-pending');
        if (newBtn)  { newBtn.style.color  = isNew ? '#2563eb' : '#6b7280'; newBtn.style.fontWeight  = isNew ? '600' : '500'; newBtn.style.borderBottom  = isNew ? '2.5px solid #2563eb' : '2.5px solid transparent'; }
        if (pendBtn) { pendBtn.style.color = isNew ? '#6b7280' : '#2563eb'; pendBtn.style.fontWeight = isNew ? '500' : '600'; pendBtn.style.borderBottom = isNew ? '2.5px solid transparent' : '2.5px solid #2563eb'; }

        var formEl    = document.getElementById('consumption-step-form');
        var resultEl  = document.getElementById('consumption-step-result');
        var doneEl    = document.getElementById('consumption-step-done');
        var pendEl    = document.getElementById('consumption-step-pending');

        if (isNew) {
            if (pendEl) pendEl.style.display = 'none';
            // Restore whichever new-request step was last active
            if (formEl)   formEl.style.display   = (_consumptionActiveNewStep === 'form'   ? 'block' : 'none');
            if (resultEl) resultEl.style.display  = (_consumptionActiveNewStep === 'result' ? 'block' : 'none');
            if (doneEl)   doneEl.style.display    = (_consumptionActiveNewStep === 'done'   ? 'block' : 'none');
        } else {
            if (formEl)   formEl.style.display   = 'none';
            if (resultEl) resultEl.style.display = 'none';
            if (doneEl)   doneEl.style.display   = 'none';
            if (pendEl)   pendEl.style.display   = 'block';
            _loadPendingPingbacks();
        }
    }

    // ── Pending Pingbacks helpers ──────────────────────────────────────────────
    function _loadPendingPingbacksBadge() {
        fetch(API_BASE + '/api/mets/transit')
        .then(function(r){ return r.json(); })
        .then(function(rows) {
            var cnt   = (rows || []).filter(function(r){ return r.status === 'held'; }).length;
            var badge = document.getElementById('ctab-pending-badge');
            if (!badge) return;
            if (cnt > 0) { badge.textContent = cnt; badge.style.display = 'inline'; }
            else         { badge.style.display = 'none'; }
        })
        .catch(function(){});
    }

    function _loadPendingPingbacks() {
        var listEl = document.getElementById('consumption-pending-list');
        if (!listEl) return;
        listEl.innerHTML = '<div style="text-align:center;padding:28px;font-size:12.5px;color:#9ca3af;">Loading…</div>';

        fetch(API_BASE + '/api/mets/transit')
        .then(function(r){ return r.json(); })
        .then(function(rows) {
            var held  = (rows || []).filter(function(r){ return r.status === 'held'; });
            var badge = document.getElementById('ctab-pending-badge');
            if (badge) {
                if (held.length > 0) { badge.textContent = held.length; badge.style.display = 'inline'; }
                else                 { badge.style.display = 'none'; }
            }
            if (held.length === 0) {
                listEl.innerHTML = '<div style="text-align:center;padding:36px 16px;">'
                    + '<div style="font-size:36px;margin-bottom:12px;">✓</div>'
                    + '<div style="font-size:13px;font-weight:600;color:#374151;margin-bottom:6px;">No Pending Pingbacks</div>'
                    + '<div style="font-size:12px;color:#9ca3af;">All soft holds have been resolved.</div>'
                    + '</div>';
                return;
            }
            var fmt = function(n){ return Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 6 }); };
            var html = held.map(function(row) {
                var ts = row.created_at || row.ts;
                var d  = ts ? new Date(ts * 1000) : new Date();
                var dateStr = d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
                            + ' ' + d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
                var jid       = row.job_id;
                var totCred   = Number(row.credits_held) || 0;
                var bd        = row.source_breakdown || {};
                // METS = monetary held from committed + unallocated only (not unit-based testing/complementary)
                var totMets   = ((bd.committed   && bd.committed.mets)   ? bd.committed.mets   : 0)
                              + ((bd.unallocated && bd.unallocated.mets) ? bd.unallocated.mets : 0);
                var testCred  = bd.testing       ? (bd.testing.credits       || 0) : 0;
                var compCred  = bd.complementary ? (bd.complementary.credits || 0) : 0;
                return '<div id="pprow-' + jid + '" data-total-credits="' + totCred + '" data-total-mets="' + totMets + '" style="background:#fff;border:1.5px solid #e5e9f2;border-radius:10px;padding:14px 16px;margin-bottom:12px;">'
                    // ── Header ──
                    + '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;">'
                    +   '<div>'
                    +     '<div style="font-family:monospace;font-size:13px;font-weight:800;color:#2563eb;">' + jid + '</div>'
                    +     '<div style="font-size:11.5px;color:#6b7280;margin-top:2px;">' + (row.feature || '—') + ' &nbsp;·&nbsp; ' + dateStr + '</div>'
                    +   '</div>'
                    +   '<span style="background:#fef9c3;color:#92400e;font-size:11px;font-weight:700;border-radius:20px;padding:2px 8px;flex-shrink:0;">Pending</span>'
                    + '</div>'
                    // ── Stats ──
                    + (function() {
                        var cols = [];
                        if (testCred > 0)  cols.push(['Testing Credits', fmt(testCred),  '#1d4ed8']);
                        if (compCred > 0)  cols.push(['Comp. Credits',   fmt(compCred),  '#7c3aed']);
                        if (totMets  > 0)  cols.push(['METS Held',       fmt(totMets),   '#111827']);
                        if (cols.length === 0) cols.push(['Total Credits', fmt(totCred), '#1d4ed8']);
                        var gridCols = cols.length === 1 ? '1fr' : cols.length === 2 ? '1fr 1fr' : '1fr 1fr 1fr';
                        return '<div style="display:grid;grid-template-columns:' + gridCols + ';gap:8px;margin-bottom:14px;">'
                            + cols.map(function(c) {
                                return '<div style="background:#f8fafc;border:1px solid #e5e9f2;border-radius:8px;padding:9px 12px;">'
                                    + '<div style="font-size:10.5px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px;">' + c[0] + '</div>'
                                    + '<div style="font-size:13px;font-weight:700;color:' + c[2] + ';">' + c[1] + '</div>'
                                    + '</div>';
                            }).join('')
                            + '</div>';
                      })()
                    // ── Partial pingback form ──
                    + (function() {
                        var showExtra = (row.feature === 'SMS' || row.feature === 'Mio AI Voice');
                        return '<div id="ppbtns-' + jid + '" style="background:#f8fafc;border:1px solid #e5e9f2;border-radius:9px;padding:12px 14px;">'
                            +   '<div style="font-size:11.5px;font-weight:600;color:#374151;margin-bottom:10px;">Pingback Credits</div>'
                            +   '<div style="display:grid;grid-template-columns:1fr 1fr 1fr' + (showExtra ? ' 1fr' : '') + ';gap:8px;margin-bottom:10px;">'
                            // Success input
                            +     '<div>'
                            +       '<div style="font-size:10.5px;font-weight:600;color:#16a34a;text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px;">Success ✓</div>'
                            +       '<input id="pp-suc-inp-' + jid + '" type="number" min="0" max="' + totCred + '" value="' + totCred + '" oninput="ppUpdateRemaining(\'' + jid + '\')" style="width:100%;border:1.5px solid #d1fae5;border-radius:7px;padding:7px 9px;font-size:13px;font-weight:700;color:#166534;font-family:inherit;box-sizing:border-box;background:#f0fdf4;outline:none;" onfocus="this.style.borderColor=\'#16a34a\'" onblur="this.style.borderColor=\'#d1fae5\'">'
                            +     '</div>'
                            // Failure input
                            +     '<div>'
                            +       '<div style="font-size:10.5px;font-weight:600;color:#ef4444;text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px;">Failure ✗</div>'
                            +       '<input id="pp-fai-inp-' + jid + '" type="number" min="0" max="' + totCred + '" value="0" oninput="ppUpdateRemaining(\'' + jid + '\')" style="width:100%;border:1.5px solid #fee2e2;border-radius:7px;padding:7px 9px;font-size:13px;font-weight:700;color:#991b1b;font-family:inherit;box-sizing:border-box;background:#fef2f2;outline:none;" onfocus="this.style.borderColor=\'#ef4444\'" onblur="this.style.borderColor=\'#fee2e2\'">'
                            +     '</div>'
                            // Remaining display
                            +     '<div>'
                            +       '<div style="font-size:10.5px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px;">Pending ◷</div>'
                            +       '<div id="pp-rem-' + jid + '" style="border:1.5px solid #e5e9f2;border-radius:7px;padding:7px 9px;font-size:13px;font-weight:700;color:#374151;background:#fff;min-height:36px;display:flex;align-items:center;">0</div>'
                            +     '</div>'
                            // Extra credits input — SMS and Mio AI Voice only
                            + (showExtra
                                ? '<div>'
                                +   '<div style="font-size:10.5px;font-weight:600;color:#d97706;text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px;">Extra (overage)</div>'
                                +   '<input id="pp-extra-inp-' + jid + '" type="number" min="0" value="0" placeholder="0" style="width:100%;border:1.5px solid #fde68a;border-radius:7px;padding:7px 9px;font-size:13px;font-weight:700;color:#92400e;font-family:inherit;box-sizing:border-box;background:#fffbeb;outline:none;" onfocus="this.style.borderColor=\'#d97706\'" onblur="this.style.borderColor=\'#fde68a\'">'
                                + '</div>'
                                : '')
                            +   '</div>'
                            // Error area
                            +   '<div id="pp-err-' + jid + '" style="display:none;font-size:12px;color:#dc2626;background:#fef2f2;border:1px solid #fecaca;border-radius:7px;padding:7px 10px;margin-bottom:8px;"></div>'
                            // Action buttons
                            +   '<div style="display:flex;gap:8px;">'
                            +     '<button onclick="consumptionPingbackById(\'' + jid + '\')" style="width:100%;padding:9px 12px;border:none;border-radius:8px;background:#2563eb;font-size:12.5px;font-weight:600;color:#fff;cursor:pointer;font-family:inherit;">Submit Pingback</button>'
                            +   '</div>'
                            + '</div>';
                      })()
                    + '</div>';
            }).join('');
            listEl.innerHTML = html;
        })
        .catch(function() {
            listEl.innerHTML = '<div style="text-align:center;padding:24px;font-size:12.5px;color:#ef4444;">Failed to load pending requests. Try refreshing.</div>';
        });
    }

    function ppUpdateRemaining(jobId) {
        var rowEl   = document.getElementById('pprow-' + jobId);
        var remEl   = document.getElementById('pp-rem-' + jobId);
        var errEl   = document.getElementById('pp-err-' + jobId);
        if (!rowEl || !remEl) return;
        var total   = parseFloat(rowEl.dataset.totalCredits) || 0;
        var suc     = parseFloat(document.getElementById('pp-suc-inp-' + jobId).value) || 0;
        var fai     = parseFloat(document.getElementById('pp-fai-inp-' + jobId).value) || 0;
        var rem     = Math.max(0, Math.round((total - suc - fai) * 1e6) / 1e6);
        remEl.textContent = rem.toLocaleString('en-IN', { maximumFractionDigits: 6 });
        if (suc + fai > total + 0.0001) {
            remEl.style.color = '#dc2626';
            if (errEl) { errEl.textContent = 'Exceeds total held (' + total.toLocaleString('en-IN') + ' credits)'; errEl.style.display = 'block'; }
        } else {
            remEl.style.color = '#374151';
            if (errEl) errEl.style.display = 'none';
        }
    }

    function ppSetAll(jobId, mode) {
        var rowEl = document.getElementById('pprow-' + jobId);
        if (!rowEl) return;
        var total = parseFloat(rowEl.dataset.totalCredits) || 0;
        var sucInp = document.getElementById('pp-suc-inp-' + jobId);
        var faiInp = document.getElementById('pp-fai-inp-' + jobId);
        if (mode === 'success') { sucInp.value = total; faiInp.value = 0; }
        else                    { sucInp.value = 0; faiInp.value = total; }
        ppUpdateRemaining(jobId);
    }

    function consumptionPingbackById(jobId) {
        var rowEl   = document.getElementById('pprow-' + jobId);
        var btnsEl  = document.getElementById('ppbtns-' + jobId);
        var errEl   = document.getElementById('pp-err-' + jobId);
        if (!rowEl) return;

        var total    = parseFloat(rowEl.dataset.totalCredits) || 0;
        var sucCred  = parseFloat(document.getElementById('pp-suc-inp-' + jobId).value) || 0;
        var faiCred  = parseFloat(document.getElementById('pp-fai-inp-' + jobId).value) || 0;
        var extraInp = document.getElementById('pp-extra-inp-' + jobId);
        var extraCred = extraInp ? (parseFloat(extraInp.value) || 0) : 0;

        if (sucCred + faiCred <= 0) {
            if (errEl) { errEl.textContent = 'Enter at least some success or failure credits.'; errEl.style.display = 'block'; }
            return;
        }
        if (sucCred + faiCred > total + 0.0001) {
            if (errEl) { errEl.textContent = 'Total exceeds held credits (' + total.toLocaleString('en-IN') + ').'; errEl.style.display = 'block'; }
            return;
        }
        if (errEl) errEl.style.display = 'none';

        // Disable all interactive elements inside the card
        var btns = btnsEl ? btnsEl.querySelectorAll('button, input') : [];
        btns.forEach(function(el){ el.disabled = true; });

        var payload = { job_id: jobId, success_credits: sucCred, failure_credits: faiCred };
        if (extraCred > 0) payload.extra_credits = extraCred;

        fetch(API_BASE + '/api/mets/pingback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
        .then(function(r){ return r.json(); })
        .then(function(data) {
            if (data.error) {
                btns.forEach(function(el){ el.disabled = false; });
                if (errEl) { errEl.textContent = data.error; errEl.style.display = 'block'; }
                return;
            }

            if (data.status === 'partial') {
                // Update row in-place with new remaining amount
                var newTotalCred = data.pending_credits;
                var newTotalMets = data.pending_mets;
                rowEl.dataset.totalCredits = newTotalCred;
                rowEl.dataset.totalMets    = newTotalMets;
                var fmt = function(n){ return Number(n||0).toLocaleString('en-IN', { maximumFractionDigits:6 }); };
                // Reset inputs
                var sucInp = document.getElementById('pp-suc-inp-' + jobId);
                var faiInp = document.getElementById('pp-fai-inp-' + jobId);
                if (sucInp) { sucInp.max = newTotalCred; sucInp.value = newTotalCred; }
                if (faiInp) { faiInp.max = newTotalCred; faiInp.value = 0; }
                ppUpdateRemaining(jobId);
                btns.forEach(function(el){ el.disabled = false; });
                // Show inline status
                if (errEl) {
                    errEl.style.display = 'block';
                    errEl.style.background = '#f0fdf4';
                    errEl.style.borderColor = '#bbf7d0';
                    errEl.style.color = '#166534';
                    errEl.textContent = '✓ ' + fmt(data.success_credits) + ' consumed · '
                        + fmt(data.failure_credits) + ' released · '
                        + fmt(newTotalCred) + ' still pending';
                }
                metsLoadBalances();
            } else {
                // Fully settled — show result state on the card
                var isConsumed  = (data.status === 'consumed');
                var bg          = isConsumed ? '#f0fdf4' : '#fef2f2';
                var borderColor = isConsumed ? '#bbf7d0' : '#fecaca';
                var textColor   = isConsumed ? '#166534' : '#991b1b';
                var iconPath    = isConsumed
                    ? '<polyline points="20 6 9 17 4 12"/>'
                    : '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';
                rowEl.style.background = bg;
                rowEl.style.border     = '1.5px solid ' + borderColor;
                if (btnsEl) {
                    btnsEl.innerHTML = '<div style="display:flex;align-items:center;gap:6px;font-size:12.5px;font-weight:700;color:' + textColor + ';">'
                        + '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="' + textColor + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' + iconPath + '</svg>'
                        + (data.message || (isConsumed ? 'Consumed successfully' : 'Released successfully'))
                        + '</div>';
                }
                // Update badge count
                var badge = document.getElementById('ctab-pending-badge');
                if (badge && badge.style.display !== 'none') {
                    var cnt = parseInt(badge.textContent || '0') - 1;
                    if (cnt > 0) { badge.textContent = cnt; } else { badge.style.display = 'none'; }
                }
                metsLoadBalances();
                if (isConsumed) {
                    usageLoadReport();
                }
            }
        })
        .catch(function() {
            btns.forEach(function(el){ el.disabled = false; });
            if (errEl) { errEl.textContent = 'Network error. Please try again.'; errEl.style.display = 'block'; }
        });
    }

    /* ────────────────────────────────────────────────────────────
       Account Notification (Onboarding > Account Notification)
       Global notification rules (Before Expiry / At Expiry / Churn /
       Inactive / Inactive→Active) with a multi-step config drawer.
       Client-side only — no backend persistence yet.
       ──────────────────────────────────────────────────────────── */
    var an_notifs = [
        { id: 'default-before-expiry', title: 'Before Expiry Reminder', type: 'Before Expiry', days: 30, banner: 'Enabled', status: 'Active', updated: 'System Default', scope: 'Global', accounts: ['ALL'], isDefault: true },
        { id: 'default-at-expiry', title: 'At Expiry Notice', type: 'At Expiry', days: null, banner: 'N/A', status: 'Active', updated: 'System Default', scope: 'Global', accounts: ['ALL'], isDefault: true },
        { id: 'default-inactive', title: 'Inactive Account Alert', type: 'Inactive', days: null, banner: 'N/A', status: 'Active', updated: 'System Default', scope: 'Global', accounts: ['ALL'], isDefault: true },
        { id: 'default-churn', title: 'Churn Form Filled Alert', type: 'Churn Form Filled', days: null, banner: 'N/A', status: 'Active', updated: 'System Default', scope: 'Global', accounts: ['ALL'], isDefault: true }
    ];
    var an_disableId = null;
    var _anActionBtn = null, _anActionId = null;
    var an_step = 0, an_editId = null, an_wiz = {};
    var an_defaultTypes = ['Before Expiry', 'At Expiry', 'Inactive', 'Churn Form Filled'];
    var an_accountOverrides = {};
    var an_filterAccounts = [];
    var an_activeTab = 'internal';
    var _anMsTrigger = null;
    var acn_accountId = null, acn_accountName = '', acn_working = {};

    function anInit() {
        anCloseAllMenus();
        anApplyFilters();
    }

    function anShowPage(id) {
        document.getElementById('an-empty-page').style.display = (id === 'an-empty-page') ? 'flex' : 'none';
        document.getElementById('an-list-page').style.display = (id === 'an-list-page') ? 'flex' : 'none';
    }

    function anToggleBannerFilter() {
        var ft = document.getElementById('an-f-type').value;
        var bf = document.getElementById('an-f-banner');
        bf.style.display = (ft === 'Before Expiry') ? 'inline-block' : 'none';
        if (ft !== 'Before Expiry') bf.value = '';
    }

    function anApplyFilters() {
        anShowPage(an_notifs.length ? 'an-list-page' : 'an-empty-page');
        var q  = (document.getElementById('an-search-input').value || '').toLowerCase();
        var ft = document.getElementById('an-f-type').value;
        var fb = document.getElementById('an-f-banner').value;
        var fs = document.getElementById('an-f-status').value;
        var rows = an_notifs.filter(function(n) {
            var accts = n.accounts || ['ALL'];
            var matchAcct = !an_filterAccounts.length
                || accts.indexOf('ALL') !== -1
                || an_filterAccounts.some(function(a){ return accts.indexOf(a) !== -1; });
            var matchTab = an_activeTab === 'internal' ? !!n.isDefault : !n.isDefault;
            return (!q || n.title.toLowerCase().indexOf(q) !== -1)
                && (!ft || n.type === ft)
                && (!fb || n.banner === fb)
                && (!fs || n.status === fs)
                && matchAcct
                && matchTab;
        });
        rows.sort(function(a, b) { return (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0); });
        anRenderRows(rows);
    }

    function anSwitchTab(tab) {
        an_activeTab = tab;
        var tOne = document.getElementById('an-tab-internal');
        var tTwo = document.getElementById('an-tab-accounts');
        if (tOne) tOne.classList.toggle('active', tab === 'internal');
        if (tTwo) tTwo.classList.toggle('active', tab === 'accounts');
        anApplyFilters();
    }

    function anResetFilters() {
        document.getElementById('an-search-input').value = '';
        document.getElementById('an-f-type').value = '';
        document.getElementById('an-f-banner').value = '';
        document.getElementById('an-f-status').value = '';
        an_filterAccounts = [];
        anUpdateMsTriggerLabel('an-f-accounts-trigger', an_filterAccounts);
        anToggleBannerFilter();
        anApplyFilters();
    }

    /* ── Shared Accounts multiselect (Quick Filter + Wizard) ── */
    function anAcctList() {
        var names = [];
        document.querySelectorAll('#ma-table-body .ma-td-name').forEach(function(td) {
            var n = td.textContent.trim();
            if (n && names.indexOf(n) === -1) names.push(n);
        });
        return names.sort();
    }
    function anUpdateMsTriggerLabel(triggerId, selected) {
        var el = document.getElementById(triggerId);
        if (!el) return;
        var label = !selected.length ? 'All Accounts'
            : selected.length <= 2 ? selected.join(', ')
            : selected.length + ' Accounts Selected';
        el.innerHTML = label + ' <span class="an-ms-caret">&#9662;</span>';
    }
    function anOpenMsDD(trigger) {
        var dd = document.getElementById('an-ms-dd');
        if (_anMsTrigger === trigger && dd.style.display === 'block') { anCloseMsDD(); return; }
        _anMsTrigger = trigger;
        anRenderMsDD();
        var rect = trigger.getBoundingClientRect();
        dd.style.display = 'block';
        dd.style.top = (rect.bottom + 6) + 'px';
        dd.style.left = rect.left + 'px';
    }
    function anCloseMsDD() {
        var dd = document.getElementById('an-ms-dd');
        if (dd) dd.style.display = 'none';
        _anMsTrigger = null;
    }
    function anRenderMsDD() {
        var dd = document.getElementById('an-ms-dd');
        var list = anAcctList();
        dd.innerHTML =
            '<div class="an-ms-dd-actions"><button onclick="anMsSelectAll()">Select All</button><button onclick="anMsClearAll()">Clear All</button></div>' +
            '<div class="an-ms-list">' + list.map(function(name) {
                var checked = an_filterAccounts.indexOf(name) !== -1;
                return '<div class="an-ms-item" onclick="anMsToggle(\'' + name.replace(/'/g, "\\'") + '\')"><input type="checkbox" ' + (checked ? 'checked' : '') + ' onclick="event.stopPropagation();anMsToggle(\'' + name.replace(/'/g, "\\'") + '\')"><span>' + name + '</span></div>';
            }).join('') + '</div>';
    }
    function anMsToggle(name) {
        var idx = an_filterAccounts.indexOf(name);
        if (idx > -1) an_filterAccounts.splice(idx, 1); else an_filterAccounts.push(name);
        anRenderMsDD();
        anUpdateMsTriggerLabel('an-f-accounts-trigger', an_filterAccounts);
        anApplyFilters();
    }
    function anMsSelectAll() {
        an_filterAccounts.length = 0;
        Array.prototype.push.apply(an_filterAccounts, anAcctList());
        anRenderMsDD();
        anUpdateMsTriggerLabel('an-f-accounts-trigger', an_filterAccounts);
        anApplyFilters();
    }
    function anMsClearAll() {
        an_filterAccounts.length = 0;
        anRenderMsDD();
        anUpdateMsTriggerLabel('an-f-accounts-trigger', an_filterAccounts);
        anApplyFilters();
    }
    document.addEventListener('click', function(e) {
        var dd = document.getElementById('an-ms-dd');
        if (dd && dd.style.display === 'block' && !dd.contains(e.target) && e.target !== _anMsTrigger && (!_anMsTrigger || !_anMsTrigger.contains(e.target))) anCloseMsDD();
    });

    function anRenderRows(rows) {
        var tb = document.getElementById('an-table-body');
        var nr = document.getElementById('an-no-results');
        tb.innerHTML = '';
        if (!rows.length) { nr.style.display = an_notifs.length ? 'block' : 'none'; return; }
        nr.style.display = 'none';
        rows.forEach(function(n) {
            var idLit = (typeof n.id === 'string') ? "'" + n.id + "'" : n.id;
            var sp = '<div class="an-status-toggle' + (n.status === 'Active' ? ' on' : '') + (n.isDefault ? ' disabled' : '') + '"' +
                (n.isDefault ? '' : ' onclick="anToggleStatus(' + idLit + ')"') +
                ' title="' + (n.status === 'Active' ? 'Active' : 'Disabled') + '"><div></div></div>';
            var bp = n.banner === 'Enabled' ? '<span class="an-pill an-pill-blue">Enabled</span>'
                   : n.banner === 'Disabled' ? '<span class="an-pill an-pill-red">Disabled</span>'
                   : '<span class="an-pill an-pill-gray">N/A</span>';
            var accts = n.accounts || ['ALL'];
            var scopeP = '<span style="color:#374151;">' + (accts.indexOf('ALL') !== -1
                ? 'All Accounts'
                : (accts.length === 1 ? accts[0] : accts.length + ' Accounts')) + '</span>';
            var tr = document.createElement('tr');
            tr.innerHTML =
                '<td><div class="an-notif-title">' + n.title + '</div><div class="an-notif-sub">' + n.type + '</div></td>' +
                '<td>' + n.type + '</td>' +
                '<td>' + scopeP + '</td>' +
                '<td style="color:#6b7280;">' + (n.days ? n.days + ' days' : '&#8212;') + '</td>' +
                '<td>' + bp + '</td>' +
                '<td>' + sp + '</td>' +
                '<td style="color:#6b7280;font-size:12px;">' + n.updated + '</td>' +
                '<td><button class="ma-action-btn" onclick="anActionToggle(this,' + idLit + ',event)">&#8943;</button></td>';
            tb.appendChild(tr);
        });
    }

    function anActionToggle(btn, id, e) {
        e.stopPropagation();
        var menu = document.getElementById('an-action-menu');
        if (_anActionBtn === btn && menu.style.display === 'block') {
            menu.style.display = 'none';
            _anActionBtn = null;
            return;
        }
        var n = an_notifs.find(function(x){ return x.id === id; });
        if (!n) return;
        _anActionBtn = btn; _anActionId = id;
        var btnStyle = 'display:flex;align-items:center;gap:9px;width:100%;padding:10px 16px;background:none;border:none;font-size:12.5px;cursor:pointer;text-align:left;font-family:inherit;';
        menu.innerHTML =
            '<button onclick="anActionDropdownClick(\'edit\')" style="' + btnStyle + 'color:#374151;" onmouseover="this.style.background=\'#f8fafc\'" onmouseout="this.style.background=\'\'">&#9998; Edit</button>' +
            (n.isDefault ? '' : (n.status === 'Active'
                ? '<button onclick="anActionDropdownClick(\'disable\')" style="' + btnStyle + 'color:#dc2626;" onmouseover="this.style.background=\'#fef2f2\'" onmouseout="this.style.background=\'\'">&#10005; Disable</button>'
                : '<button onclick="anActionDropdownClick(\'enable\')" style="' + btnStyle + 'color:#16a34a;" onmouseover="this.style.background=\'#f0fdf4\'" onmouseout="this.style.background=\'\'">&#10003; Enable</button>'));
        var rect = btn.getBoundingClientRect();
        menu.style.display = 'block';
        var menuW = 150;
        var left = rect.right - menuW;
        if (left < 8) left = 8;
        menu.style.top  = (rect.bottom + 6) + 'px';
        menu.style.left = left + 'px';
    }

    function anActionDropdownClick(action) {
        var id = _anActionId;
        document.getElementById('an-action-menu').style.display = 'none';
        _anActionBtn = null; _anActionId = null;
        if (action === 'edit') anOpenEdit(id);
        else if (action === 'disable') anOpenModal(id);
        else if (action === 'enable') anEnableN(id);
    }

    function anCloseAllMenus() {
        var menu = document.getElementById('an-action-menu');
        if (menu) { menu.style.display = 'none'; _anActionBtn = null; }
    }
    document.addEventListener('click', function(e) {
        var menu = document.getElementById('an-action-menu');
        if (menu && !menu.contains(e.target) && e.target !== _anActionBtn) anCloseAllMenus();
    });

    function anShowTotal() { anShowToast('Total records: ' + an_notifs.length); }

    function anOpenModal(id) {
        an_disableId = id;
        document.getElementById('an-disable-overlay').style.display = 'block';
        document.getElementById('an-disable-modal').style.display = 'block';
    }
    function anCloseModal() {
        document.getElementById('an-disable-overlay').style.display = 'none';
        document.getElementById('an-disable-modal').style.display = 'none';
        an_disableId = null;
    }
    function anConfirmDisable() {
        var n = an_notifs.find(function(x){ return x.id === an_disableId; });
        if (n) n.status = 'Disabled';
        anCloseModal();
        anApplyFilters();
        anShowToast('Notification disabled');
    }
    function anEnableN(id) {
        var n = an_notifs.find(function(x){ return x.id === id; });
        if (n) n.status = 'Active';
        anApplyFilters();
        anShowToast('Notification enabled');
    }
    function anToggleStatus(id) {
        var n = an_notifs.find(function(x){ return x.id === id; });
        if (!n || n.isDefault) return;
        if (n.status === 'Active') anOpenModal(id);
        else anEnableN(id);
    }

    /* ── Wizard ── */
    function anFreshWiz() {
        return {
            name: '', type: '', days: '', accounts: [], isDefault: false, chkAM: false, chkSP: false, mails: [],
            freqType: 'one-time', freqEvery: '1', freqUnit: 'days', freqOn: '', freqTime: '09:00',
            bannerOn: false, bannerDays: '7',
            bannerTxt: 'Your subscription will end in {{subscription_days_remaining}} days. To continue using the platform, Connect with your Account Manager.',
            subjLine: '', body: ''
        };
    }
    var anEmailTpl = {
        'Before Expiry': { s: 'Your subscription is about to expire', b: 'Hi [Account Admin Name],\n\nThis is a reminder that your subscription will expire in {{subscription_days_remaining}} days.\n\nTo ensure uninterrupted service, please renew your subscription before the expiration date.\n\nThanks and Regards,\nTeam Meritto' },
        'At Expiry': { s: 'Your subscription has expired', b: "Hi [Account Admin Name],\n\nThis is to inform you that your subscription with Meritto has expired as of {{subscription_end_date}}.\n\nWe've temporarily paused your access to premium features.\n\nPlease renew at the earliest. For assistance, write to support@meritto.com.\n\nTeam Meritto" },
        'Churn Form Filled': { s: 'Accounts with Churn Form Filled', b: 'Hi Team,\n\nThe following accounts have churn form filled:\n\nAccount ID | Account Name | Associated SPOCs\n\nThanks and Regards,\nMeritto Team' },
        'Inactive': { s: 'Accounts Marked Inactive', b: 'Hi Team,\n\nThe following accounts have been marked inactive:\n\nAccount ID | Account Name | Inactive Marked On | Associated SPOCs\n\nThanks and Regards,\nMeritto Team' },
        'Inactive → Active': { s: 'Accounts Moved from Inactive to Active', b: 'Hi Team,\n\nThe following accounts have been moved from inactive to active:\n\nAccount ID | Account Name | Associated SPOCs\n\nThanks and Regards,\nMeritto Team' }
    };
    var anDefaultSubj = {
        'Before Expiry': '{{account_name}} subscription is about to expire in {{subscription_days_remaining}}',
        'At Expiry': '{{account_name}} subscription has expired',
        'Inactive': '{{account_name}} has been marked as an inactive account',
        'Churn Form Filled': 'Churn form filled for {{account_name}}'
    };
    var anDefaultBody = {
        'Before Expiry': 'Hi Team,\n\nThis is to inform you that the subscription for the below account is expiring in {{subscription_days_remaining}}:\n\nAccount Name: {{account_name}}\nAccount ID: {{account_id}}\n\nKindly connect with the client and initiate the renewal process to ensure there is no disruption in services.\n\nThanks and Regards,\nTeam Meritto',
        'At Expiry': 'Hi Team,\n\nThis is to inform you that the subscription for the below account has expired as of {{subscription_end_date}}:\n\nAccount Name: {{account_name}}\nAccount ID: {{account_id}}\n\nKindly connect with the client and initiate the renewal process at the earliest to avoid extended disruption in services.\n\nThanks and Regards,\nTeam Meritto',
        'Inactive': 'Hi Team,\n\nThis is to inform you that the below account has been marked as inactive:\n\nAccount Name: {{account_name}}\nAccount ID: {{account_id}}\n\nKindly connect with the client to understand the reason for inactivity and take appropriate action to re-engage the account.\n\nThanks and Regards,\nTeam Meritto',
        'Churn Form Filled': 'Hi Team,\n\nThis is to inform you that the below account has submitted a churn form:\n\nAccount Name: {{account_name}}\nAccount ID: {{account_id}}\n\nKindly connect with the client at the earliest to understand their concerns and explore retention options.\n\nThanks and Regards,\nTeam Meritto'
    };
    var anTypeHints = {
        'At Expiry': 'Mail triggers on the Subscription End Date. No banner configuration needed for this type.',
        'Churn Form Filled': 'Mail triggers when churn is marked on an account. No banner configuration for this type.',
        'Inactive': 'Mail triggers on the date the account is marked inactive. No banner configuration for this type.',
        'Inactive → Active': 'Mail triggers when the account is again made Active from Inactive. No banner configuration for this type.'
    };
    function anGetSteps() {
        return (an_wiz.type === '' || an_wiz.type === 'Before Expiry')
            ? ['Notification Config', 'Communication', 'Email Content', 'Banner Settings']
            : ['Notification Config', 'Communication', 'Email Content'];
    }
    function anOpenDrawer(eId) {
        an_editId = eId || null; an_step = 0;
        if (eId) {
            var n = an_notifs.find(function(x){ return x.id === eId; });
            an_wiz = anFreshWiz();
            if (n) {
                an_wiz.name = n.title; an_wiz.type = n.type; an_wiz.days = n.days || ''; an_wiz.bannerOn = n.banner === 'Enabled';
                an_wiz.isDefault = !!n.isDefault;
                an_wiz.accounts = (n.accounts || ['ALL']).slice();
                an_wiz.subjLine = n.subjLine || ''; an_wiz.body = n.body || '';
                if (an_wiz.isDefault) {
                    an_wiz.bannerTxt = n.bannerTxt || '{{account_name}} subscription will end in {{subscription_days_remaining}} days.';
                    an_wiz.subjLine = n.subjLine || anDefaultSubj[an_wiz.type] || anDefaultSubj['Before Expiry'];
                    an_wiz.body = n.body || anDefaultBody[an_wiz.type] || anDefaultBody['Before Expiry'];
                    an_wiz.freqType = an_wiz.type === 'Before Expiry' ? (n.freqType || 'recurring') : 'one-time';
                    an_wiz.freqEvery = n.freqEvery || '10';
                    an_wiz.freqTime = n.freqTime || '10:00';
                }
            }
            document.getElementById('an-drawer-title').textContent = 'Edit Notification';
        } else {
            an_wiz = anFreshWiz();
            document.getElementById('an-drawer-title').textContent = 'Add Notification (Accounts)';
        }
        anCloseMsDD();
        anRenderDrawer();
        document.getElementById('an-drawer').style.display = 'flex';
        document.getElementById('an-drawer-overlay').style.display = 'block';
    }
    function anOpenEdit(id) { anOpenDrawer(id); }
    function anCloseDrawer() {
        anCloseMsDD();
        document.getElementById('an-drawer').style.display = 'none';
        document.getElementById('an-drawer-overlay').style.display = 'none';
        anHideDrawerErr();
    }
    function anRenderStepper() {
        var steps = anGetSteps();
        var el = document.getElementById('an-stepper');
        el.innerHTML = '';
        steps.forEach(function(s, i) {
            var d = document.createElement('div');
            d.className = 'an-step' + (i < an_step ? ' done' : i === an_step ? ' active' : '');
            d.innerHTML = '<div class="an-step-num">' + (i < an_step ? '&#10003;' : (i + 1)) + '</div><div class="an-step-lbl">' + s + '</div>';
            el.appendChild(d);
        });
    }
    function anRenderBody() {
        var steps = anGetSteps();
        var body = document.getElementById('an-drawer-body');
        var isInt = ['Churn Form Filled', 'Inactive', 'Inactive → Active'].indexOf(an_wiz.type) !== -1;
        if (an_step === 0) {
            var curAcct = an_wiz.isDefault ? 'ALL' : (an_wiz.accounts[0] && an_wiz.accounts[0] !== 'ALL' ? an_wiz.accounts[0] : '');
            var acctFieldHTML = '<div class="an-fg"><label>Select Account <span style="color:#dc2626;">*</span></label><select id="an-wiz-account-select" ' + (an_wiz.isDefault ? 'disabled' : '') + ' onchange="an_wiz.accounts=[this.value]">' +
                    (an_wiz.isDefault
                        ? '<option value="ALL" selected>All Accounts</option>'
                        : '<option value="" ' + (curAcct === '' ? 'selected' : '') + ' disabled>Select account...</option>' +
                          anAcctList().map(function(name){ return '<option value="' + name + '" ' + (curAcct === name ? 'selected' : '') + '>' + name + '</option>'; }).join('')) +
                  '</select>' + (an_wiz.isDefault ? '<span class="an-hint">This is a system default notification — it always applies to all accounts.</span>' : '<span class="an-hint">Select the individual account this notification applies to.</span>') + '</div>';
            body.innerHTML = '<div class="an-section-card"><div class="an-sec-title">Notification Configuration</div><div class="an-sec-sub">Define the trigger name and type to trigger the notification.</div>' +
                '<div class="an-fg"><label>Notification Name <span style="color:#dc2626;">*</span></label><input id="an-f-name" placeholder="e.g. 30-Day Renewal Reminder" value="' + an_wiz.name + '"></div>' +
                acctFieldHTML +
                '<div class="an-fg"><label>Notification Type <span style="color:#dc2626;">*</span></label><select id="an-wiz-type" onchange="anOnType()"><option value="">Select type...</option>' +
                    (an_wiz.isDefault ? ['Before Expiry','At Expiry','Churn Form Filled','Inactive','Inactive → Active'] : ['Before Expiry','At Expiry']).map(function(t){ return '<option ' + (an_wiz.type === t ? 'selected' : '') + '>' + t + '</option>'; }).join('') +
                '</select></div>' +
                '<div id="an-days-wrap" style="display:' + (an_wiz.type === 'Before Expiry' ? 'block' : 'none') + ';"><div class="an-fg"><label>Days Before Expiry <span style="color:#dc2626;">*</span></label><input id="an-f-days" type="number" min="1" max="90" placeholder="Enter 1–90" value="' + an_wiz.days + '"><span class="an-hint">Trigger: Subscription end date &middot; Range: 1 to 90 days</span></div></div>' +
                '<div class="an-hint" id="an-type-hint" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:9px 12px;margin-top:-4px;display:' + (an_wiz.type && an_wiz.type !== 'Before Expiry' ? 'block' : 'none') + ';">' + (anTypeHints[an_wiz.type] || '') + '</div></div>';
        } else if (an_step === 1) {
            var noRecurring = ['At Expiry', 'Inactive', 'Churn Form Filled'].indexOf(an_wiz.type) !== -1;
            var isRec = !noRecurring && an_wiz.freqType === 'recurring';
            var daysArr = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
            var selDays = (an_wiz.freqOn || '').split(',').filter(Boolean);
            var commHTML = '<div class="an-section-card"><div class="an-sec-title">Communication Settings</div><div class="an-sec-sub">Select who receives this notification. All email IDs added in the Custom Mail IDs field below will receive the notification directly.</div>' +
                (!an_wiz.isDefault && !isInt ? '<div class="an-chk-card locked"><input type="checkbox" checked disabled style="pointer-events:none;"><div><div class="an-chk-lbl">Account Admin <span style="font-size:10.5px;color:#9ca3af;font-weight:400;">(Primary — always included)</span></div><div class="an-chk-sub">Primary recipient for all accounts</div></div></div>' : '') +
                (an_wiz.isDefault
                    ? '<div class="an-chk-card locked"><input type="checkbox" id="an-chk-am" checked disabled style="pointer-events:none;"><div><div class="an-chk-lbl">Associated SPOCs <span style="font-size:10.5px;color:#9ca3af;font-weight:400;">(Always included)</span></div><div class="an-chk-sub">Notifies the assigned associated SPOCs</div></div></div>'
                    : '<div class="an-chk-card" onclick="document.getElementById(\'an-chk-am\').click()"><input type="checkbox" id="an-chk-am" ' + (an_wiz.chkAM || isInt ? 'checked' : '') + ' onclick="event.stopPropagation()"><div><div class="an-chk-lbl">Associated SPOCs</div><div class="an-chk-sub">Notifies the assigned associated SPOCs</div></div></div>') +
                (an_wiz.isDefault
                    ? '<div class="an-chk-card locked"><input type="checkbox" id="an-chk-sp" checked disabled style="pointer-events:none;"><div><div class="an-chk-lbl">Account Manager <span style="font-size:10.5px;color:#9ca3af;font-weight:400;">(Always included)</span></div><div class="an-chk-sub">Notifies the assigned account manager</div></div></div>'
                    : '<div class="an-chk-card" onclick="document.getElementById(\'an-chk-sp\').click()"><input type="checkbox" id="an-chk-sp" ' + (an_wiz.chkSP ? 'checked' : '') + ' onclick="event.stopPropagation()"><div><div class="an-chk-lbl">Management SPOCs</div><div class="an-chk-sub">Notifies management points of contact</div></div></div>') +
                '<hr style="border:none;border-top:1px solid #f3f4f6;margin:14px 0;">' +
                '<div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:4px;">Custom Mail IDs <span style="color:#9ca3af;font-weight:400;font-size:11px;">(' + (an_wiz.isDefault ? 'meritto.com / collexo.com only' : 'any valid email') + ' &middot; max 10)</span></div>' +
                '<div style="font-size:11px;color:#6b7280;margin-bottom:8px;line-height:1.5;">All email IDs added here will receive the notification mail directly.</div>' +
                '<div style="display:flex;gap:7px;margin-bottom:8px;"><input id="an-mail-inp" placeholder="' + (an_wiz.isDefault ? 'e.g. admin@meritto.com, manager@collexo.com' : 'e.g. admin@university.com, manager@org.com') + '" style="flex:1;border:1.5px solid #d1d5db;border-radius:7px;padding:7px 10px;font-size:12.5px;outline:none;font-family:inherit;" onkeydown="if(event.key===\'Enter\')anAddMail()"><button style="padding:7px 14px;border:1.5px solid #e5e7eb;border-radius:7px;background:#fff;font-size:12.5px;color:#374151;cursor:pointer;font-family:inherit;" onclick="anAddMail()">Add</button></div>' +
                '<div id="an-mail-tags" style="display:flex;flex-wrap:wrap;gap:5px;min-height:4px;">' + an_wiz.mails.map(function(m, i){ return '<span class="an-mail-tag">' + m + '<button onclick="anRmMail(' + i + ')">&#215;</button></span>'; }).join('') + '</div>' +
                '<div id="an-mail-err" style="font-size:11px;color:#dc2626;margin-top:4px;display:none;"></div></div>';
            var freqHTML = '<div class="an-section-card" style="margin-top:0;">' +
                '<div class="an-sec-title">Frequency Settings</div><div class="an-sec-sub" style="margin-bottom:14px;">Configure how often this notification should be triggered after the event.</div>' +
                '<div style="display:flex;gap:8px;margin-bottom:14px;">' +
                    '<div onclick="anSetFreq(\'one-time\')" id="an-freq-opt-one" class="an-freq-opt' + (isRec ? '' : ' sel') + '">' +
                        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;"><div class="an-freq-dot" style="width:14px;height:14px;border-radius:50%;border:2px solid ' + (isRec ? '#d1d5db' : '#2563eb') + ';background:' + (isRec ? '#fff' : '#2563eb') + ';display:flex;align-items:center;justify-content:center;flex-shrink:0;">' + (isRec ? '' : '<div style="width:5px;height:5px;border-radius:50%;background:#fff;"></div>') + '</div><span class="an-freq-lbl" style="font-size:12.5px;font-weight:600;color:' + (isRec ? '#111827' : '#1d4ed8') + ';">One-time</span></div>' +
                        '<div style="font-size:11px;color:#6b7280;margin-left:22px;">Send notification once when the trigger event occurs</div></div>' +
                    (noRecurring ? '' :
                    '<div onclick="anSetFreq(\'recurring\')" id="an-freq-opt-rec" class="an-freq-opt' + (isRec ? ' sel' : '') + '">' +
                        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;"><div class="an-freq-dot" style="width:14px;height:14px;border-radius:50%;border:2px solid ' + (isRec ? '#2563eb' : '#d1d5db') + ';background:' + (isRec ? '#2563eb' : '#fff') + ';display:flex;align-items:center;justify-content:center;flex-shrink:0;">' + (isRec ? '<div style="width:5px;height:5px;border-radius:50%;background:#fff;"></div>' : '') + '</div><span class="an-freq-lbl" style="font-size:12.5px;font-weight:600;color:' + (isRec ? '#1d4ed8' : '#111827') + ';">Recurring</span></div>' +
                        '<div style="font-size:11px;color:#6b7280;margin-left:22px;">Send notification repeatedly at a set interval</div></div>') +
                '</div>' +
                '<div id="an-freq-recurring-cfg" style="display:' + (isRec ? 'block' : 'none') + ';">' +
                    '<div style="margin-bottom:12px;"><div style="font-size:11.5px;font-weight:600;color:#374151;margin-bottom:6px;">Send every</div>' +
                        '<div style="display:flex;align-items:center;gap:8px;"><input id="an-freq-every" type="number" min="1" max="90" value="' + an_wiz.freqEvery + '" style="width:72px;border:1.5px solid #d1d5db;border-radius:7px;padding:7px 10px;font-size:12.5px;outline:none;font-family:inherit;" oninput="an_wiz.freqEvery=this.value">' +
                        '<select id="an-freq-unit" style="flex:1;border:1.5px solid #d1d5db;border-radius:7px;padding:7px 10px;font-size:12.5px;color:#111827;outline:none;font-family:inherit;" onchange="an_wiz.freqUnit=this.value;anToggleFreqOn()">' +
                            '<option value="days"' + (an_wiz.freqUnit === 'days' ? ' selected' : '') + '>Day(s)</option>' +
                            '<option value="weeks"' + (an_wiz.freqUnit === 'weeks' ? ' selected' : '') + '>Week(s)</option>' +
                            '<option value="months"' + (an_wiz.freqUnit === 'months' ? ' selected' : '') + '>Month(s)</option>' +
                        '</select></div>' +
                        (an_wiz.type === 'Before Expiry' && an_wiz.days ? '<div style="font-size:10.5px;color:#6b7280;margin-top:6px;">Interval must be less than <strong>' + parseInt(an_wiz.days, 10) + ' days</strong> (configured before expiry period). Day(s)=1x, Week(s)=7x, Month(s)=30x.</div>' : '') +
                    '</div>' +
                    '<div style="margin-bottom:12px;"><div style="font-size:11.5px;font-weight:600;color:#374151;margin-bottom:6px;">Time of communication trigger</div>' +
                        '<input id="an-freq-time" type="time" style="width:100%;border:1.5px solid #d1d5db;border-radius:7px;padding:8px 10px;font-size:13px;color:#111827;outline:none;font-family:inherit;background:#fff;cursor:pointer;display:block;">' +
                        '<span style="font-size:10.5px;color:#9ca3af;margin-top:4px;display:block;">The notification mail will be triggered at this time each interval</span></div>' +
                    '<div id="an-freq-on-wrap" style="display:' + (an_wiz.freqUnit === 'weeks' ? 'block' : 'none') + ';margin-bottom:12px;"><div style="font-size:11.5px;font-weight:600;color:#374151;margin-bottom:6px;">On day</div>' +
                        '<div style="display:flex;gap:6px;flex-wrap:wrap;" id="an-freq-days-row">' +
                            daysArr.map(function(d){ var a = selDays.indexOf(d) > -1; return '<div data-day="' + d + '" onclick="anToggleDay(&quot;' + d + '&quot;)" style="padding:5px 12px;border-radius:20px;font-size:11.5px;font-weight:600;cursor:pointer;border:1px solid ' + (a ? '#2563eb' : '#e5e7eb') + ';background:' + (a ? '#eff6ff' : '#fff') + ';color:' + (a ? '#1d4ed8' : '#374151') + ';">' + d + '</div>'; }).join('') +
                        '</div><span style="font-size:10.5px;color:#9ca3af;margin-top:4px;display:block;">Select one or more days</span></div>' +
                '</div>' +
                '<div id="an-freq-summary" style="display:' + (isRec ? 'none' : 'block') + ';background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:9px 12px;font-size:12px;color:#6b7280;">This notification will be sent <strong>once</strong> when the trigger event occurs.</div>' +
            '</div>';
            body.innerHTML = commHTML + freqHTML;
            var ti = document.getElementById('an-freq-time');
            if (ti) ti.value = an_wiz.freqTime || '09:00';
        } else if (steps[steps.length - 1] === 'Banner Settings' && an_step === steps.length - 1) {
            body.innerHTML = '<div class="an-section-card"><div class="an-sec-title">Banner Settings</div><div class="an-sec-sub">Show a banner stripe to ' + (an_wiz.isDefault ? 'Internal users' : 'account users') + ' as a subscription reminder on the platform.</div>' +
                '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;"><label style="position:relative;width:34px;height:18px;cursor:pointer;flex-shrink:0;display:inline-block;"><input type="checkbox" id="an-sw-banner" ' + (an_wiz.bannerOn ? 'checked' : '') + ' onchange="anToggleBanner()" style="opacity:0;width:0;height:0;"><span style="position:absolute;inset:0;background:' + (an_wiz.bannerOn ? '#2563eb' : '#d1d5db') + ';border-radius:20px;transition:background .2s;"></span><span style="position:absolute;top:2px;left:' + (an_wiz.bannerOn ? '18px' : '2px') + ';width:14px;height:14px;background:#fff;border-radius:50%;transition:left .2s;"></span></label><span style="font-size:12.5px;color:#374151;font-weight:600;">Enable banner stripe</span><span style="font-size:11px;color:#9ca3af;">Preview shows below when enabled</span></div>' +
                '<div id="an-banner-cfg" style="display:' + (an_wiz.bannerOn ? 'block' : 'none') + ';">' +
                    '<div class="an-fg"><label>Show banner how many days before expiry?</label><select id="an-f-bdays" onchange="an_wiz.bannerDays=this.value">' + [1,2,3,5,7,10,14,21,30].map(function(d){ return '<option ' + (an_wiz.bannerDays == d ? 'selected' : '') + '>' + d + '</option>'; }).join('') + '</select><span class="an-hint">Range: 1–30 days before subscription end date</span></div>' +
                    '<div class="an-fg"><label>Banner Content</label><textarea id="an-banner-editor" rows="3" oninput="anUpdateBannerPreview()">' + an_wiz.bannerTxt + '</textarea><span class="an-hint">Edit the message shown to account users in the banner</span></div>' +
                    '<div style="margin-bottom:14px;"><div style="font-size:11.5px;font-weight:600;color:#374151;margin-bottom:6px;">Available Tokens <span style="color:#9ca3af;font-weight:400;font-size:11px;">— click to insert into banner</span></div><div style="display:flex;gap:6px;flex-wrap:wrap;">' +
                        [{token:'{{subscription_days_remaining}}',label:'Days Remaining'},{token:'{{subscription_end_date}}',label:'Subscription End Date'},{token:'{{account_name}}',label:'Account Name'},{token:'{{account_manager}}',label:'Account Manager'}].map(function(t){ return '<span class="an-tok" onclick="anInsertBannerToken(\'' + t.token + '\')">' + t.token + '</span>'; }).join('') +
                    '</div></div>' +
                    '<div style="font-size:11.5px;font-weight:600;color:#374151;margin-bottom:6px;">Preview</div>' +
                    '<div class="an-banner-prev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><span id="an-banner-txt">' + an_wiz.bannerTxt + '</span></div>' +
                '</div></div>';
        } else {
            var tpl = anEmailTpl[an_wiz.type] || anEmailTpl['Before Expiry'];
            if (!an_wiz.subjLine) { an_wiz.subjLine = tpl.s; an_wiz.body = an_wiz.isDefault ? tpl.b.replace('[Account Admin Name]', 'Team') : tpl.b; }
            var isIntE = ['Churn Form Filled', 'Inactive', 'Inactive → Active'].indexOf(an_wiz.type) !== -1;
            body.innerHTML = '<div class="an-section-card"><div class="an-sec-title">Email Content</div><div class="an-sec-sub">Review and customise the default email template for this notification.</div>' +
                '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;margin-bottom:14px;">' +
                    '<div style="display:flex;gap:8px;margin-bottom:5px;"><span style="font-size:11px;color:#9ca3af;min-width:72px;font-weight:600;">From</span><span style="font-size:11.5px;color:#374151;">Meritto &lt;Notifications@meritto.com&gt;</span></div>' +
                    '<div style="display:flex;gap:8px;margin-bottom:5px;"><span style="font-size:11px;color:#9ca3af;min-width:72px;font-weight:600;">To</span><span style="font-size:11.5px;color:#374151;">' + (an_wiz.isDefault ? 'Associated SPOCs and Account Manager' : (isIntE ? 'Associated SPOCs (Primary)' : 'Account Admin (Primary)')) + '</span></div>' +
                    '<div style="display:flex;gap:8px;"><span style="font-size:11px;color:#9ca3af;min-width:72px;font-weight:600;">Recipients</span><span style="font-size:11.5px;color:#374151;">All custom mail IDs configured in Communication step</span></div>' +
                '</div>' +
                '<div class="an-fg"><label>Subject Line</label><input id="an-f-subj" value="' + an_wiz.subjLine + '" oninput="an_wiz.subjLine=this.value"></div>' +
                '<div class="an-fg"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;"><label style="margin:0;">Email Body</label><button style="background:none;border:none;color:#6b7280;font-size:11px;cursor:pointer;padding:4px 8px;border-radius:5px;font-family:inherit;" onclick="anEditBody()">&#9998; Edit</button></div><textarea id="an-f-body" rows="7" oninput="an_wiz.body=this.value">' + an_wiz.body + '</textarea></div>' +
                '<div><div style="font-size:11.5px;font-weight:600;color:#374151;margin-bottom:6px;">Available Tokens <span style="color:#9ca3af;font-weight:400;font-size:11px;">&#8212; click to insert into body</span></div><div style="display:flex;flex-wrap:wrap;gap:5px;">' +
                    (an_wiz.isDefault ? ['{{subscription_days_remaining}}','{{subscription_end_date}}','{{account_name}}','{{associated_spocs}}','{{account_manager}}','{{account_id}}'] : ['{{subscription_days_remaining}}','{{subscription_end_date}}','{{account_name}}','{{account_admin_name}}','{{associated_spocs}}','{{account_manager}}','{{account_id}}']).map(function(t){ return '<span class="an-tok" onclick="anInsertTok(\'' + t + '\')">' + t + '</span>'; }).join('') +
                '</div></div></div>';
        }
    }
    function anRenderDrawer() { anHideDrawerErr(); anRenderStepper(); anRenderBody(); anUpdateFooter(); }
    function anUpdateFooter() {
        var steps = anGetSteps();
        document.getElementById('an-btn-back').style.display = an_step > 0 ? 'inline-flex' : 'none';
        document.getElementById('an-btn-next').innerHTML = (an_step === steps.length - 1) ? 'Save Configuration' : 'Next &rarr;';
    }
    function anOnType() {
        an_wiz.type = document.getElementById('an-wiz-type').value;
        an_wiz.subjLine = ''; an_wiz.body = '';
        document.getElementById('an-days-wrap').style.display = (an_wiz.type === 'Before Expiry') ? 'block' : 'none';
        var th = document.getElementById('an-type-hint');
        th.style.display = (an_wiz.type && an_wiz.type !== 'Before Expiry') ? 'block' : 'none';
        th.textContent = anTypeHints[an_wiz.type] || '';
        anRenderStepper();
    }
    function anStepNext() {
        var steps = anGetSteps();
        if (an_step === 0) {
            an_wiz.name = (document.getElementById('an-f-name') && document.getElementById('an-f-name').value || '').trim();
            an_wiz.type = (document.getElementById('an-wiz-type') && document.getElementById('an-wiz-type').value) || an_wiz.type;
            if (!an_wiz.name) { anShowDrawerErr('Please enter a notification name.'); return; }
            if (an_wiz.isDefault) {
                an_wiz.accounts = ['ALL'];
            } else {
                var acctEl = document.getElementById('an-wiz-account-select');
                var acctVal = acctEl ? acctEl.value : '';
                if (!acctVal) { anShowDrawerErr('Please select an account.'); return; }
                an_wiz.accounts = [acctVal];
            }
            if (!an_wiz.type) { anShowDrawerErr('Please select a notification type.'); return; }
            if (an_wiz.type === 'Before Expiry') {
                an_wiz.days = (document.getElementById('an-f-days') && document.getElementById('an-f-days').value) || '';
                if (!an_wiz.days || an_wiz.days < 1 || an_wiz.days > 90) { anShowDrawerErr('Days must be between 1 and 90.'); return; }
            }
        }
        if (an_step === 1) {
            an_wiz.chkAM = document.getElementById('an-chk-am') ? document.getElementById('an-chk-am').checked : false;
            an_wiz.chkSP = document.getElementById('an-chk-sp') ? document.getElementById('an-chk-sp').checked : false;
            an_wiz.freqType = an_wiz.freqType || 'one-time';
            an_wiz.freqEvery = (document.getElementById('an-freq-every') && document.getElementById('an-freq-every').value) || an_wiz.freqEvery;
            an_wiz.freqUnit  = (document.getElementById('an-freq-unit')  && document.getElementById('an-freq-unit').value)  || an_wiz.freqUnit;
            an_wiz.freqTime  = (document.getElementById('an-freq-time')  && document.getElementById('an-freq-time').value)  || an_wiz.freqTime;
            if (an_wiz.freqType === 'recurring' && an_wiz.type === 'Before Expiry') {
                var every = parseInt(an_wiz.freqEvery, 10) || 0;
                var unit = an_wiz.freqUnit;
                var daysBeforeExpiry = parseInt(an_wiz.days, 10) || 0;
                var everyInDays = unit === 'days' ? every : unit === 'weeks' ? every * 7 : every * 30;
                if (every < 1) { anShowDrawerErr('Please enter a valid interval (minimum 1).'); return; }
                if (everyInDays >= daysBeforeExpiry) {
                    var unitLabel = unit === 'days' ? 'day(s)' : unit === 'weeks' ? 'week(s)' : 'month(s)';
                    anShowDrawerErr('Recurring interval (' + every + ' ' + unitLabel + ') must be less than the configured ' + daysBeforeExpiry + ' days before expiry.'); return;
                }
            }
        }
        if (steps[an_step] === 'Banner Settings') {
            an_wiz.bannerOn = document.getElementById('an-sw-banner') ? document.getElementById('an-sw-banner').checked : false;
            an_wiz.bannerDays = (document.getElementById('an-f-bdays') && document.getElementById('an-f-bdays').value) || an_wiz.bannerDays;
            an_wiz.bannerTxt = (document.getElementById('an-banner-editor') && document.getElementById('an-banner-editor').value) || an_wiz.bannerTxt;
        }
        if (an_step === steps.length - 1) {
            an_wiz.subjLine = (document.getElementById('an-f-subj') && document.getElementById('an-f-subj').value) || an_wiz.subjLine;
            an_wiz.body = (document.getElementById('an-f-body') && document.getElementById('an-f-body').value) || an_wiz.body;
            anSaveConfig(); return;
        }
        anCloseMsDD();
        an_step++; anRenderDrawer(); document.getElementById('an-drawer-body').scrollTop = 0;
    }
    function anStepPrev() { anCloseMsDD(); if (an_step > 0) { an_step--; anRenderDrawer(); document.getElementById('an-drawer-body').scrollTop = 0; } }
    function anSaveConfig() {
        var hasBanner = anGetSteps().indexOf('Banner Settings') !== -1;
        var now = new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        var existing = an_editId ? an_notifs.find(function(x){ return x.id === an_editId; }) : null;
        var rec = {
            id: an_editId || Date.now(), title: an_wiz.name, type: an_wiz.type,
            days: an_wiz.type === 'Before Expiry' ? parseInt(an_wiz.days, 10) : null,
            banner: hasBanner ? (an_wiz.bannerOn ? 'Enabled' : 'Disabled') : 'N/A',
            status: existing ? existing.status : 'Active', updated: now,
            scope: 'Global', isDefault: existing ? !!existing.isDefault : false,
            accounts: an_wiz.accounts.slice(),
            subjLine: an_wiz.subjLine, body: an_wiz.body
        };
        if (an_editId) {
            var idx = an_notifs.findIndex(function(x){ return x.id === an_editId; });
            if (idx > -1) an_notifs[idx] = rec;
        } else {
            an_notifs.unshift(rec);
        }
        anCloseDrawer();
        anApplyFilters();
        anShowToast('Notification configured successfully');
    }
    function anAddMail() {
        var inp = document.getElementById('an-mail-inp');
        var v = inp.value.trim();
        var err = document.getElementById('an-mail-err');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { err.style.display = 'block'; err.textContent = 'Please enter a valid email address.'; return; }
        if (an_wiz.isDefault && !/@(meritto\.com|collexo\.com)$/i.test(v)) { err.style.display = 'block'; err.textContent = 'Only meritto.com or collexo.com email addresses are allowed for system default notifications.'; return; }
        if (an_wiz.mails.indexOf(v) !== -1) { err.style.display = 'block'; err.textContent = 'This email is already added.'; return; }
        if (an_wiz.mails.length >= 10) { err.style.display = 'block'; err.textContent = 'Max 10 custom mail IDs allowed.'; return; }
        err.style.display = 'none'; an_wiz.mails.push(v); inp.value = '';
        document.getElementById('an-mail-tags').innerHTML = an_wiz.mails.map(function(m, i){ return '<span class="an-mail-tag">' + m + '<button onclick="anRmMail(' + i + ')">&#215;</button></span>'; }).join('');
    }
    function anRmMail(i) {
        an_wiz.mails.splice(i, 1);
        document.getElementById('an-mail-tags').innerHTML = an_wiz.mails.map(function(m, j){ return '<span class="an-mail-tag">' + m + '<button onclick="anRmMail(' + j + ')">&#215;</button></span>'; }).join('');
    }
    function anToggleBanner() {
        an_wiz.bannerOn = document.getElementById('an-sw-banner').checked;
        document.getElementById('an-banner-cfg').style.display = an_wiz.bannerOn ? 'block' : 'none';
        anRenderBody();
    }
    function anInsertBannerToken(t) {
        var ta = document.getElementById('an-banner-editor');
        if (!ta) return;
        var s = ta.selectionStart, e = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + t + ta.value.slice(e);
        an_wiz.bannerTxt = ta.value;
        ta.focus(); ta.selectionStart = ta.selectionEnd = s + t.length;
        anUpdateBannerPreview();
    }
    function anUpdateBannerPreview() {
        var v = document.getElementById('an-banner-editor') ? document.getElementById('an-banner-editor').value : '';
        an_wiz.bannerTxt = v;
        var p = document.getElementById('an-banner-txt');
        if (p) p.textContent = v;
    }
    function anEditBody() {
        var v = prompt('Edit email body:', an_wiz.body);
        if (v) { an_wiz.body = v; document.getElementById('an-f-body').value = v; }
    }
    function anInsertTok(t) {
        var ta = document.getElementById('an-f-body');
        if (!ta) return;
        var s = ta.selectionStart, e = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + t + ta.value.slice(e);
        an_wiz.body = ta.value;
        ta.focus(); ta.selectionStart = ta.selectionEnd = s + t.length;
    }
    function anSetFreq(type) {
        an_wiz.freqType = type;
        if (type === 'recurring') {
            setTimeout(function() {
                var ti = document.getElementById('an-freq-time');
                if (ti) ti.value = an_wiz.freqTime || '09:00';
            }, 10);
        }
        anRenderBody();
    }
    function anToggleFreqOn() {
        var u = document.getElementById('an-freq-unit') ? document.getElementById('an-freq-unit').value : an_wiz.freqUnit;
        an_wiz.freqUnit = u;
        var wrap = document.getElementById('an-freq-on-wrap');
        if (wrap) wrap.style.display = (u === 'weeks') ? 'block' : 'none';
    }
    function anToggleDay(d) {
        var days = (an_wiz.freqOn || '').split(',').filter(Boolean);
        var idx = days.indexOf(d);
        if (idx > -1) days.splice(idx, 1); else days.push(d);
        an_wiz.freqOn = days.join(',');
        var row = document.getElementById('an-freq-days-row');
        if (row) row.querySelectorAll('[data-day]').forEach(function(el) {
            var active = days.indexOf(el.getAttribute('data-day')) > -1;
            el.style.border = '1px solid ' + (active ? '#2563eb' : '#e5e7eb');
            el.style.background = active ? '#eff6ff' : '#fff';
            el.style.color = active ? '#1d4ed8' : '#374151';
        });
    }
    function anShowDrawerErr(msg) {
        var b = document.getElementById('an-drawer-err'), t = document.getElementById('an-drawer-err-txt');
        if (!b || !t) return;
        t.textContent = msg; b.style.display = 'flex';
        b.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    function anHideDrawerErr() {
        var b = document.getElementById('an-drawer-err');
        if (b) b.style.display = 'none';
    }
    function anShowToast(msg) {
        var t = document.getElementById('an-toast');
        document.getElementById('an-toast-txt').textContent = msg;
        t.classList.add('show');
        setTimeout(function(){ t.classList.remove('show'); }, 3200);
    }
    window.anInit = anInit;

    /* ────────────────────────────────────────────────────────────
       Account-level Notification Settings (per-account overrides)
       Opened from Manage Accounts > row action > "Notification
       Settings". Every account inherits the global rules above by
       default; this drawer lets an admin override a rule for one
       specific account only. Client-side only, keyed by account id.
       ──────────────────────────────────────────────────────────── */
    function acnSlug(type) { return type.toLowerCase().replace(/[^a-z0-9]+/g, '-'); }

    function acnDefaultSummary(type) {
        var d = an_notifs.find(function(x) { return x.type === type && x.isDefault; });
        if (!d) return 'No global rule configured';
        var bits = [];
        if (d.days) bits.push(d.days + ' days before expiry');
        bits.push(d.status);
        if (d.banner === 'Enabled') bits.push('Banner enabled');
        return bits.join(' \u00b7 ');
    }

    function acnOpenDrawer(accountId, accountName) {
        acn_accountId = accountId; acn_accountName = accountName;
        document.getElementById('acn-drawer-sub').textContent = 'Overrides for ' + accountName + ' (' + accountId + ')';
        var saved = an_accountOverrides[accountId] || {};
        acn_working = {};
        an_defaultTypes.forEach(function(t) {
            acn_working[t] = saved[t]
                ? { enabled: true, days: saved[t].days, status: saved[t].status, bannerOn: saved[t].bannerOn }
                : { enabled: false, days: '', status: 'Active', bannerOn: false };
        });
        acnRenderBody();
        document.getElementById('acn-drawer').style.display = 'flex';
        document.getElementById('acn-drawer-overlay').style.display = 'block';
    }

    function acnCloseDrawer() {
        document.getElementById('acn-drawer').style.display = 'none';
        document.getElementById('acn-drawer-overlay').style.display = 'none';
    }

    function acnRenderBody() {
        var body = document.getElementById('acn-drawer-body');
        var html = '';
        an_defaultTypes.forEach(function(type) {
            var w = acn_working[type];
            var showDays = (type === 'Before Expiry');
            html += '<div class="an-section-card">' +
                '<div class="an-sec-title">' + type + '</div>' +
                '<div class="an-sec-sub">Global default: ' + acnDefaultSummary(type) + '</div>' +
                '<label class="an-chk-card" style="margin-bottom:' + (w.enabled ? '11px' : '0') + ';">' +
                    '<input type="checkbox" ' + (w.enabled ? 'checked' : '') + ' onchange="acnToggleOverride(\'' + type + '\')">' +
                    '<div><div class="an-chk-lbl">Override for ' + acn_accountName + '</div>' +
                    '<div class="an-chk-sub">Use custom settings for this account instead of the global rule</div></div>' +
                '</label>' +
                (w.enabled ? (
                    '<div style="display:flex;flex-direction:column;gap:12px;">' +
                    (showDays
                        ? '<div class="an-fg" style="margin-bottom:0;"><label>Days Before Expiry</label><input type="number" min="1" value="' + w.days + '" onchange="acnUpdateField(\'' + type + '\',\'days\',this.value)"></div>'
                        : '') +
                    '<div class="an-fg" style="margin-bottom:0;"><label>Status</label><select onchange="acnUpdateField(\'' + type + '\',\'status\',this.value)"><option' + (w.status === 'Active' ? ' selected' : '') + '>Active</option><option' + (w.status === 'Disabled' ? ' selected' : '') + '>Disabled</option></select></div>' +
                    (showDays
                        ? '<label class="an-chk-card" style="margin-bottom:0;"><input type="checkbox" ' + (w.bannerOn ? 'checked' : '') + ' onchange="acnUpdateField(\'' + type + '\',\'bannerOn\',this.checked)"><div><div class="an-chk-lbl">Show Renewal Banner</div><div class="an-chk-sub">Display an in-app banner to this account before expiry</div></div></label>'
                        : '') +
                    '</div>'
                ) : '') +
            '</div>';
        });
        body.innerHTML = html;
    }

    function acnToggleOverride(type) {
        var w = acn_working[type];
        w.enabled = !w.enabled;
        if (w.enabled && !w.days) {
            var d = an_notifs.find(function(x) { return x.type === type && x.isDefault; });
            w.days = (d && d.days) ? d.days : 30;
        }
        acnRenderBody();
    }

    function acnUpdateField(type, field, val) {
        acn_working[type][field] = (field === 'days') ? parseInt(val, 10) : val;
    }

    function acnSaveOverrides() {
        var out = {}, any = false;
        an_defaultTypes.forEach(function(type) {
            if (acn_working[type].enabled) { out[type] = acn_working[type]; any = true; }
        });
        if (any) an_accountOverrides[acn_accountId] = out;
        else delete an_accountOverrides[acn_accountId];
        acnCloseDrawer();
        anShowToast('Notification settings updated for ' + acn_accountName);
    }

    window.acnOpenDrawer = acnOpenDrawer;

    // ── Day Planner ────────────────────────────────────────────────────────────
    // A day-wise task planner (localStorage-backed) plus a "Team Tracker" list for
    // tasks owned by other teams that the user has no dependency on but wants to
    // keep visibility on. Opened from the calendar icon beside "Ask Mio AI".
    var DP_STORAGE_KEY = 'dayPlannerData_v1';
    var dpSelectedDate = dpToDateKey(new Date());
    var dpWeekAnchor = new Date();
    // Team Tracker statuses (unrelated to the per-task statuses below).
    var DP_STATUS_OPTIONS = ['Pending', 'In Progress', 'Blocked', 'Done'];
    var DP_STATUS_COLORS = { 'Pending': '#888888', 'In Progress': '#e8900a', 'Blocked': '#d94040', 'Done': '#1a9e6e' };
    var DP_STATUS_BG = { 'Pending': '#F3F4F6', 'In Progress': '#FFF7ED', 'Blocked': '#FEF2F2', 'Done': '#ECFDF5' };
    // My Day task "Task Owner" — who/what stage the task currently sits with. Users
    // can add their own beyond the built-ins via the "+ Add new status…" option.
    // "Me" marks a task as still on the user's own plate (shown in "My Tasks");
    // every other value means it has moved to another team/stage (shown under
    // "Team"). Carry-forward/closing is owned entirely by the separate Status field
    // (taskState, below) — Task Owner has no "Closed" value and no date logic.
    var DP_TASK_STATUSES = ['Me', 'At Product', 'In Dev', 'In QA', 'At Ops', 'At CS'];
    var DP_TASK_STATUS_COLORS = { 'Me': '#4f46e5', 'At Product': '#7c3aed', 'In Dev': '#2979d4', 'In QA': '#f59e0b', 'At Ops': '#0d9488', 'At CS': '#db2777' };
    var DP_TASK_STATUS_BG = { 'Me': '#EEF2FF', 'At Product': '#F5F3FF', 'In Dev': '#EFF6FF', 'In QA': '#FFFBEB', 'At Ops': '#F0FDFA', 'At CS': '#FDF2F8' };
    var DP_TASK_STATUS_DEFAULT_COLOR = '#64748b';
    var DP_TASK_STATUS_DEFAULT_BG = '#F8FAFC';
    // A separate, simpler "Status" field (Open/Hold/Closed) — entirely independent of
    // the Task Owner field above (DP_TASK_STATUSES): it doesn't drive My Day/Team
    // Tracker routing or carry-forward, it's just a lightweight state on the task.
    var DP_TASK_STATE_VALUES = ['Open', 'Hold', 'Closed'];
    var DP_TASK_STATE_COLORS = { 'Open': '#16a34a', 'Hold': '#d97706', 'Closed': '#6b7280' };
    var DP_TASK_STATE_BG = { 'Open': '#ECFDF5', 'Hold': '#FFFBEB', 'Closed': '#F3F4F6' };
    var DP_ICON_CALENDAR = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
    var DP_ICON_CHECK = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>';

    function dpToDateKey(d) {
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }
    // Day Planner data now lives in Postgres (dp_tasks / dp_tracker_items /
    // dp_custom_statuses, via /api/day-planner) instead of localStorage. Every
    // call site in this file still reads/writes through dpLoadData()/dpSaveData()
    // synchronously, so rather than rewriting all of them to be async, this is a
    // write-through cache: DP_REMOTE_CACHE is the in-memory source of truth,
    // dpLoadRemote() populates it once on page load, and dpSaveData() updates it
    // immediately (so the UI never waits on the network) while persisting to the
    // backend in the background. localStorage is kept only as an offline cache —
    // it's the backend that's authoritative, not the browser.
    var DP_REMOTE_CACHE = null;
    function dpLoadData() {
        if (DP_REMOTE_CACHE) return DP_REMOTE_CACHE;
        return { taskList: [], tracker: [], customTaskStatuses: [], customAssignees: [], auditLog: [] };
    }
    function dpSetLocalCache(data) {
        if (!data.taskList) data.taskList = [];
        if (!data.tracker) data.tracker = [];
        if (!data.customTaskStatuses) data.customTaskStatuses = [];
        if (!data.customAssignees) data.customAssignees = [];
        if (!data.auditLog) data.auditLog = [];
        DP_REMOTE_CACHE = data;
        try { localStorage.setItem(DP_STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
    }
    // Surfaces a small dismissible banner when a save to the server fails, so a
    // broken DB connection isn't silently invisible — the local cache (and
    // therefore the UI) is already correct either way, but the change hasn't
    // actually reached Postgres yet. Clears itself automatically on the next
    // successful save.
    function dpShowSyncWarning(message) {
        var el = document.getElementById('dpSyncWarning');
        if (!el) {
            el = document.createElement('div');
            el.id = 'dpSyncWarning';
            el.className = 'dp-sync-warning';
            document.body.appendChild(el);
        }
        el.innerHTML = '<span>' + dpEsc(message) + '</span><button type="button" class="dp-sync-warning-close" onclick="this.parentElement.style.display=\'none\'">&times;</button>';
        el.style.display = 'flex';
    }
    function dpClearSyncWarning() {
        var el = document.getElementById('dpSyncWarning');
        if (el) el.style.display = 'none';
    }
    function dpSaveData(data) {
        dpSetLocalCache(data);
        fetch(API_BASE + '/api/day-planner', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(function (res) {
            if (res.ok) { dpClearSyncWarning(); return; }
            return res.json().catch(function () { return {}; }).then(function (body) {
                console.error('[Day Planner] Save to server failed (HTTP ' + res.status + '):', body.error || res.statusText);
                dpShowSyncWarning("Couldn't save to the server — your changes are kept on this device only.");
            });
        }).catch(function (e) {
            console.error('[Day Planner] Save to server failed (network error):', e);
            dpShowSyncWarning("Couldn't reach the server — your changes are kept on this device only.");
        });
    }
    // Fetches the persisted state from the backend once on load. If the backend
    // is unreachable, starts empty rather than falling back to old local data.
    // Coalesces concurrent calls into a single in-flight request rather than
    // firing one GET per caller.
    var _dpLoadRemotePromise = null;
    function dpLoadRemote() {
        if (_dpLoadRemotePromise) return _dpLoadRemotePromise;
        _dpLoadRemotePromise = fetch(API_BASE + '/api/day-planner')
            .then(function (r) { return r.json(); })
            .then(function (res) {
                dpSetLocalCache({
                    taskList: (res && res.taskList) || [],
                    tracker: (res && res.tracker) || [],
                    customTaskStatuses: (res && res.customTaskStatuses) || [],
                    customAssignees: (res && res.customAssignees) || [],
                    auditLog: (res && res.auditLog) || []
                });
            })
            .catch(function (e) {
                dpSetLocalCache({ taskList: [], tracker: [], customTaskStatuses: [], customAssignees: [], auditLog: [] });
            })
            .finally(function () { _dpLoadRemotePromise = null; });
        return _dpLoadRemotePromise;
    }
    function dpEsc(s) {
        return String(s || '').replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    // Appends one entry to the Day Planner's audit log (newest first, capped at 300
    // so the payload synced on every save stays bounded). Callers pass the same
    // `data` object they're about to hand to dpSaveData, so the entry is persisted
    // atomically with whatever change it's describing.
    function dpLogAudit(data, action, detail) {
        if (!data.auditLog) data.auditLog = [];
        data.auditLog.unshift({ id: 'al_' + Date.now() + '_' + Math.floor(Math.random() * 1000), ts: Date.now(), action: action, detail: detail });
        if (data.auditLog.length > 300) data.auditLog.length = 300;
    }

    // A task whose Status is "Closed" is only visible on the day it was closed; Open
    // or Hold both carry the task forward onto every day from its start date on.
    // This is driven by the Status field (taskState), not Task Owner (status).
    function dpVisibleTasksForDate(data, dateKey) {
        return (data.taskList || []).filter(function (t) {
            if (t.taskState === 'Closed') return t.closedDate === dateKey;
            return t.startDate <= dateKey;
        });
    }

    function dpFormatDate(key) {
        if (!key) return '';
        var d = new Date(key + 'T00:00:00');
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    // Start/Expected date chips show formatted text ("Sep 22", matching the Closed
    // chip's style) instead of a raw native date input — clicking the text opens the
    // real (visually hidden) <input type="date"> right after it via the picker API,
    // so editing still works exactly as before.
    window.dpOpenDateChipPicker = function (valueSpan) {
        var input = valueSpan.nextElementSibling;
        if (!input) return;
        if (input.showPicker) {
            try { input.showPicker(); } catch (e) { input.focus(); }
        } else {
            input.focus();
        }
    };

    // Builds the <option> list for a task's status <select>: the 6 built-ins, any
    // custom statuses the user has added, then a trailing "+ Add new status…" entry.
    function dpTaskStatusOptions(data, current) {
        var all = DP_TASK_STATUSES.concat(data.customTaskStatuses || []);
        var opts = all.map(function (s) { return '<option' + (s === current ? ' selected' : '') + '>' + s + '</option>'; }).join('');
        opts += '<option value="__add_new__">+ Add new status…</option>';
        return opts;
    }

    // Builds the <option> list for a task's Status <select> — a fixed 3-value enum
    // (Open/Hold/Closed), no "+ Add new…" since it isn't user-extensible.
    function dpTaskStateOptions(current) {
        return DP_TASK_STATE_VALUES.map(function (s) {
            return '<option' + (s === current ? ' selected' : '') + '>' + s + '</option>';
        }).join('');
    }
    // Handles a task's Status <select> changing. This is what owns carry-forward now:
    // Closed sets closedDate to the day the change happened on (dpVisibleTasksForDate
    // then only shows the task on that day); Open/Hold clear it so the task carries
    // forward from its start date as usual. viewedDateKey is the day being viewed
    // when the change happened — the day the task will be pinned to if now Closed.
    window.dpSetTaskState = function (id, value, viewedDateKey) {
        var data = dpLoadData();
        var t = (data.taskList || []).find(function (x) { return x.id === id; });
        if (t) {
            dpLogAudit(data, 'Status changed', 'Set Status for "' + t.title + '" from "' + t.taskState + '" to "' + value + '".');
            t.taskState = value;
            t.closedDate = (value === 'Closed') ? (viewedDateKey || dpToDateKey(new Date())) : null;
        }
        dpSaveData(data);
        if (t && value === 'Closed') wfRunTriggers('Task Closed', { taskId: id });
        dpRenderTasks();
        dpRenderTracker();
        dpRenderDateStrip();
        dashRenderMyTasks();
    };

    // Handles a task's Task Owner <select> changing — including the special "add a
    // new status" option, which prompts for a name, persists it for reuse, and
    // applies it. Purely about who/what stage the task sits with; carry-forward and
    // closing are owned by the Status field (dpSetTaskState) and untouched here.
    window.dpSetTaskStatus = function (id, value) {
        var data = dpLoadData();
        if (value === '__add_new__') {
            var name = window.prompt('Name the new status:');
            if (!name || !name.trim()) { dpRenderTasks(); dpRenderTracker(); dashRenderMyTasks(); return; }
            name = name.trim();
            if (!data.customTaskStatuses) data.customTaskStatuses = [];
            var known = DP_TASK_STATUSES.concat(data.customTaskStatuses);
            if (known.indexOf(name) === -1) data.customTaskStatuses.push(name);
            value = name;
        }
        var t = (data.taskList || []).find(function (x) { return x.id === id; });
        if (t) {
            dpLogAudit(data, 'Task Owner changed', 'Set Task Owner for "' + t.title + '" from "' + t.status + '" to "' + value + '".');
            t.status = value;
        }
        dpSaveData(data);
        if (t) {
            wfRunTriggers('Task Status Changed', { taskId: id });
            if (value !== 'Me') wfRunTriggers('Task Moved to Team', { taskId: id });
        }
        dpRenderTasks();
        dpRenderTracker();
        dpRenderDateStrip();
        dashRenderMyTasks();
    };

    // Expected closure may never be earlier than start date — both dpSetTaskDate
    // (existing tasks) and dpAddTask (the creation form) reject the change against
    // this shared check rather than duplicating the comparison logic.
    function dpDatesValid(startDate, expectedDate) {
        return !(startDate && expectedDate && expectedDate < startDate);
    }
    // Keeps the Add Task form's Expected Closure date picker from even offering a
    // date earlier than Start Date — a soft (native-picker) version of the same
    // dpDatesValid check dpAddTask enforces on submit.
    window.dpSyncNewTaskExpectedMin = function (startVal) {
        var expectedInput = document.getElementById('dpNewTaskExpected');
        if (!expectedInput) return;
        if (startVal) expectedInput.min = startVal;
        else expectedInput.removeAttribute('min');
    };
    // Updates a task's Start Date or Expected Closure Date (Actual Close Date is not
    // editable here — it is set automatically by dpSetTaskState when a task closes).
    window.dpSetTaskDate = function (id, field, value) {
        var data = dpLoadData();
        var t = (data.taskList || []).find(function (x) { return x.id === id; });
        if (!t) return;
        var nextStart = field === 'startDate' ? (value || null) : t.startDate;
        var nextExpected = field === 'expectedCloseDate' ? (value || null) : t.expectedCloseDate;
        if (!dpDatesValid(nextStart, nextExpected)) {
            window.alert('Expected closure date cannot be before the start date.');
            dpRenderTasks();
            dpRenderTracker();
            return;
        }
        var fieldLabel = field === 'startDate' ? 'Start date' : 'Expected closure';
        dpLogAudit(data, 'Date changed', 'Set ' + fieldLabel + ' for "' + t.title + '" to ' + (value ? dpFormatDate(value) : '(cleared)') + '.');
        t[field] = value || null;
        dpSaveData(data);
        dpRenderTasks();
        dpRenderTracker();
        dpRenderDateStrip();
        dashRenderMyTasks();
    };

    // Recomputes the three summary cards at the top of the page — today's tasks,
    // this week's completion, and a status breakdown of tracked team tasks.
    function dpRenderStats() {
        var data = dpLoadData();
        var todayKey = dpToDateKey(new Date());
        var todayTasks = dpVisibleTasksForDate(data, todayKey);
        var todayDone = todayTasks.filter(function (t) { return t.taskState === 'Closed'; }).length;
        var todayFractionEl = document.getElementById('dpStatTodayFraction');
        var todayPctEl = document.getElementById('dpStatTodayPct');
        var todayPct = todayTasks.length ? Math.round((todayDone / todayTasks.length) * 100) : 0;
        if (todayFractionEl) todayFractionEl.textContent = todayDone + ' / ' + todayTasks.length;
        if (todayPctEl) todayPctEl.textContent = todayPct + '%';
        var ring = document.getElementById('dpTodayRing');
        if (ring) {
            ring.style.background = 'conic-gradient(#2979d4 ' + (todayPct * 3.6) + 'deg, #e5e7eb 0deg)';
        }

        // A "week" here means Monday through Friday only.
        var anchor = new Date(dpWeekAnchor);
        var dow = anchor.getDay();
        var monday = new Date(anchor);
        monday.setDate(anchor.getDate() - ((dow + 6) % 7));
        var mondayKey = dpToDateKey(monday);
        var friday = new Date(monday);
        friday.setDate(monday.getDate() + 4);
        var fridayKey = dpToDateKey(friday);
        // "This week" counts each task once (not once per carried-forward day): any
        // task open at some point this week, plus any task actually closed this week.
        var weekTasks = (data.taskList || []).filter(function (t) {
            if (t.taskState === 'Closed') return t.closedDate >= mondayKey && t.closedDate <= fridayKey;
            return t.startDate <= fridayKey;
        });
        var weekTotal = weekTasks.length;
        var weekDone = weekTasks.filter(function (t) { return t.taskState === 'Closed'; }).length;
        var weekFractionEl = document.getElementById('dpStatWeekFraction');
        if (weekFractionEl) weekFractionEl.textContent = weekDone + ' / ' + weekTotal;

        // Team Tracker's total/breakdown cover both sources shown in that tab: My Day
        // tasks that moved off "Me" (real dp_tasks — the primary path now that "+
        // Track Task" creates one directly) and any legacy manually-tracked items
        // (data.tracker) still hanging around. Counts are built from whatever
        // statuses actually occur rather than a fixed list, since the two sources
        // can carry different status vocabularies.
        var teamTasksToday = todayTasks.filter(function (t) { return t.status !== 'Me'; });
        var trackerTotalEl = document.getElementById('dpStatTrackerTotal');
        var trackerBreakdownEl = document.getElementById('dpStatTrackerBreakdown');
        if (trackerTotalEl) trackerTotalEl.textContent = teamTasksToday.length + data.tracker.length;
        if (trackerBreakdownEl) {
            var counts = {};
            var order = [];
            function bump(s) {
                if (counts[s] === undefined) { counts[s] = 0; order.push(s); }
                counts[s]++;
            }
            teamTasksToday.forEach(function (t) { bump(t.status); });
            data.tracker.forEach(function (t) { bump(t.status); });
            trackerBreakdownEl.innerHTML = order.map(function (s) {
                var color = DP_TASK_STATUS_COLORS[s] || DP_STATUS_COLORS[s] || DP_TASK_STATUS_DEFAULT_COLOR;
                return '<div style="display:flex;align-items:center;gap:5px;font-size:11px;color:#6b7280;"><span class="dp-filter-dot" style="background:' + color + ';"></span>' + dpEsc(s) + ': ' + counts[s] + '</div>';
            }).join('');
        }
    }

    var _dpObserver = null;
    function _syncDpLeft() {
        var sb = document.getElementById('sidebar');
        var overlay = document.getElementById('day-planner-overlay');
        if (sb && overlay) overlay.style.left = sb.getBoundingClientRect().width + 'px';
    }
    window.openDayPlanner = function () {
        var mets = document.getElementById('mets-overlay');
        if (mets && mets.style.display !== 'none' && window.closeMetsOverlay) closeMetsOverlay();
        var commLog = document.getElementById('comm-log-overlay');
        if (commLog && commLog.style.display !== 'none' && window.closeCommLog) closeCommLog();
        var commDetail = document.getElementById('comm-detail-overlay');
        if (commDetail && commDetail.style.display !== 'none' && window.closeCommDetail) closeCommDetail();
        var workflowOverlayDp = document.getElementById('workflow-overlay');
        if (workflowOverlayDp && workflowOverlayDp.style.display !== 'none' && window.closeWorkflowBuilder) closeWorkflowBuilder();
        var workflowDesignerDp = document.getElementById('workflow-designer-overlay');
        if (workflowDesignerDp && workflowDesignerDp.style.display !== 'none') workflowDesignerDp.style.display = 'none';
        var settingsView = document.getElementById('settings-view');
        if (settingsView && settingsView.classList.contains('open')) settingsView.classList.remove('open');
        var overlay = document.getElementById('day-planner-overlay');
        if (!overlay) return;
        _syncDpLeft();
        overlay.style.display = 'block';
        var sb = document.getElementById('sidebar');
        if (sb && window.ResizeObserver && !_dpObserver) {
            _dpObserver = new ResizeObserver(_syncDpLeft);
            _dpObserver.observe(sb);
        }
        wfProcessPendingRuns();
        dpSelectedDate = dpToDateKey(new Date());
        dpWeekAnchor = dpMondayOf(new Date());
        dpSwitchTab('myday');
        dpRenderDateStrip();
        dpRenderTasks();
        dpRenderTracker();
    };
    window.closeDayPlanner = function () {
        var overlay = document.getElementById('day-planner-overlay');
        if (overlay) overlay.style.display = 'none';
        if (_dpObserver) { _dpObserver.disconnect(); _dpObserver = null; }
        var agentPanel = document.getElementById('dpAgentPanel');
        if (agentPanel) agentPanel.style.display = 'none';
        var datePicker = document.getElementById('dpDatePickerPopover');
        if (datePicker) datePicker.style.display = 'none';
        // Reset the Add Task drawer synchronously (skipping its slide-out transition)
        // so reopening the planner later never shows it pre-open with a stale backdrop.
        var addModal = document.getElementById('dpAddTaskModal');
        if (addModal) { addModal.classList.remove('dp-drawer-open'); addModal.style.display = 'none'; }
        var addBackdrop = document.getElementById('dpAddTaskBackdrop');
        if (addBackdrop) addBackdrop.style.display = 'none';
        var auditDrawer = document.getElementById('dpAuditLogDrawer');
        if (auditDrawer) { auditDrawer.classList.remove('dp-drawer-open'); auditDrawer.style.display = 'none'; }
        var auditBackdrop = document.getElementById('dpAuditLogBackdrop');
        if (auditBackdrop) auditBackdrop.style.display = 'none';
    };

    window.dpSwitchTab = function (tab) {
        var myDay = document.getElementById('dpPanelMyDay');
        var tracker = document.getElementById('dpPanelTracker');
        var myDayBtn = document.getElementById('dpTabMyDayBtn');
        var trackerBtn = document.getElementById('dpTabTrackerBtn');
        if (myDay) myDay.style.display = tab === 'myday' ? '' : 'none';
        if (tracker) tracker.style.display = tab === 'tracker' ? '' : 'none';
        if (myDayBtn) myDayBtn.classList.toggle('active', tab === 'myday');
        if (trackerBtn) trackerBtn.classList.toggle('active', tab === 'tracker');
        if (tab === 'tracker') dpRenderTracker();
        // Switching tabs jumps back to the top of the page so the stats cards and
        // tab row are visible, instead of staying wherever the previous tab was scrolled to.
        var overlay = document.getElementById('day-planner-overlay');
        if (overlay) overlay.scrollTop = 0;
    };

    // Monday of the calendar week containing `date` — used by the "standard"
    // navigation entry points (Today, This Week, initial open) so they always show
    // a conventional Mon–Fri week regardless of wherever the strip was last scrolled.
    function dpMondayOf(date) {
        var d = new Date(date);
        var dow = d.getDay();
        d.setDate(d.getDate() - ((dow + 6) % 7));
        return d;
    }
    // Returns `count` consecutive working days (Mon–Fri, weekends skipped)
    // starting at `startDate` — or at the next Monday if `startDate` itself falls
    // on a weekend. The date strip always shows exactly 5 of these, so whatever
    // day dpWeekAnchor is set to becomes the first pill: picking a date in the
    // calendar (dpPickerPickDate) starts the strip right there — it no longer
    // snaps to that date's containing Mon–Fri week — while dpMondayOf-driven
    // entry points naturally reproduce the classic full Mon–Fri week.
    function dpWorkingDaysFrom(startDate, count) {
        var d = new Date(startDate);
        while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
        var days = [];
        while (days.length < count) {
            if (d.getDay() !== 0 && d.getDay() !== 6) days.push(new Date(d));
            d.setDate(d.getDate() + 1);
        }
        return days;
    }
    function dpRenderDateStrip() {
        var strip = document.getElementById('dpDateStrip');
        if (!strip) return;
        var days = dpWorkingDaysFrom(dpWeekAnchor, 5);
        // The label always reads the actual displayed span, start to end.
        var labelStart = days[0], labelEnd = days[4];
        var todayKey = dpToDateKey(new Date());
        var data = dpLoadData();
        strip.innerHTML = days.map(function (d) {
            var key = dpToDateKey(d);
            var isSel = key === dpSelectedDate;
            var isToday = key === todayKey;
            var hasTasks = dpVisibleTasksForDate(data, key).length > 0;
            var dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
            return '<div class="dp-day-pill' + (isSel ? ' dp-day-pill-active' : '') + (isToday ? ' dp-day-today' : '') + '" onclick="dpSelectDate(\'' + key + '\')">' +
                '<div class="dp-day-name">' + dayName + '</div>' +
                '<div class="dp-day-num">' + d.getDate() + '</div>' +
                (hasTasks ? '<div class="dp-day-dot"></div>' : '') +
            '</div>';
        }).join('');
        var label = document.getElementById('dpWeekLabel');
        if (label) {
            label.textContent = labelStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
                ' – ' + labelEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
    }

    window.dpSelectDate = function (key) {
        dpSelectedDate = key;
        dpRenderDateStrip();
        dpRenderTasks();
    };
    window.dpShiftWeek = function (delta) {
        dpWeekAnchor.setDate(dpWeekAnchor.getDate() + delta * 7);
        dpRenderDateStrip();
    };
    window.dpGoToday = function () {
        dpWeekAnchor = dpMondayOf(new Date());
        dpSelectedDate = dpToDateKey(new Date());
        dpRenderDateStrip();
        dpRenderTasks();
    };
    // Distinct from dpGoToday: jumps to the current week but selects its
    // Monday, for reviewing the week from the start rather than jumping
    // straight to today. Triggered by clicking the "This Week" stat card.
    window.dpGoThisWeek = function () {
        dpWeekAnchor = dpMondayOf(new Date());
        dpSelectedDate = dpToDateKey(dpWeekAnchor);
        dpRenderDateStrip();
        dpRenderTasks();
    };

    // ── Date-picker popover (jump to any date directly, not just week-by-week) ─
    var dpPickerMonth = new Date();
    window.dpToggleDatePicker = function () {
        var pop = document.getElementById('dpDatePickerPopover');
        var btn = document.getElementById('dpWeekLabelBtn');
        if (!pop) return;
        var isOpen = pop.style.display !== 'none';
        if (isOpen) {
            pop.style.display = 'none';
            if (btn) btn.classList.remove('dp-picker-open');
            document.removeEventListener('click', dpDatePickerOutsideClick, true);
        } else {
            dpPickerMonth = new Date(dpSelectedDate + 'T00:00:00');
            dpRenderDatePicker();
            pop.style.display = 'block';
            if (btn) btn.classList.add('dp-picker-open');
            setTimeout(function () { document.addEventListener('click', dpDatePickerOutsideClick, true); }, 0);
        }
    };
    function dpDatePickerOutsideClick(e) {
        var pop = document.getElementById('dpDatePickerPopover');
        var btn = document.getElementById('dpWeekLabelBtn');
        if (!pop || pop.style.display === 'none') return;
        if (pop.contains(e.target) || (btn && btn.contains(e.target))) return;
        dpToggleDatePicker();
    }
    window.dpPickerShiftMonth = function (delta) {
        dpPickerMonth.setMonth(dpPickerMonth.getMonth() + delta);
        dpRenderDatePicker();
    };
    function dpRenderDatePicker() {
        var grid = document.getElementById('dpDatePickerGrid');
        if (!grid) return;
        var monthLabel = document.getElementById('dpPickerMonthLabel');
        if (monthLabel) monthLabel.textContent = dpPickerMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        var year = dpPickerMonth.getFullYear(), month = dpPickerMonth.getMonth();
        var firstOfMonth = new Date(year, month, 1);
        var gridStart = new Date(firstOfMonth);
        gridStart.setDate(gridStart.getDate() - firstOfMonth.getDay());
        var todayKey = dpToDateKey(new Date());
        var cells = [];
        for (var i = 0; i < 42; i++) {
            var d = new Date(gridStart);
            d.setDate(gridStart.getDate() + i);
            var key = dpToDateKey(d);
            var isMuted = d.getMonth() !== month;
            var isToday = key === todayKey;
            var isSelected = key === dpSelectedDate;
            var cls = 'dp-date-picker-cell' + (isMuted ? ' dp-date-picker-cell-muted' : '') +
                (isToday && !isSelected ? ' dp-date-picker-cell-today' : '') + (isSelected ? ' dp-date-picker-cell-selected' : '');
            cells.push('<div class="' + cls + '" onclick="dpPickerPickDate(\'' + key + '\')">' + d.getDate() + '</div>');
        }
        grid.innerHTML = cells.join('');
    }
    window.dpPickerPickDate = function (key) {
        dpSelectedDate = key;
        dpWeekAnchor = new Date(key + 'T00:00:00');
        dpRenderDateStrip();
        dpRenderTasks();
        dpToggleDatePicker();
    };

    // Renders one task's full card (title, status, delete, date chips) — shared by
    // both the "My Tasks" and "Team" groups in the My Day list.
    function dpTaskRowHtml(t, data, viewedDateKey) {
        var isClosed = t.taskState === 'Closed';
        var color = DP_TASK_STATUS_COLORS[t.status] || DP_TASK_STATUS_DEFAULT_COLOR;
        var bg = DP_TASK_STATUS_BG[t.status] || DP_TASK_STATUS_DEFAULT_BG;
        return '<div class="dp-task-row' + (isClosed ? ' dp-task-done' : '') + '" style="border-left-color:' + color + ';">' +
            '<div class="dp-task-top">' +
                '<div class="dp-task-text">' +
                    '<div class="dp-task-title">' + dpEsc(t.title) + '</div>' +
                    (t.description ? '<div class="dp-task-desc">' + dpEsc(t.description) + '</div>' : '') +
                    (t.time ? '<div class="dp-task-time">' + dpEsc(t.time) + '</div>' : '') +
                '</div>' +
                '<select class="dp-task-status" style="background-color:' + (DP_TASK_STATE_BG[t.taskState] || DP_TASK_STATE_BG.Open) + ';color:' + (DP_TASK_STATE_COLORS[t.taskState] || DP_TASK_STATE_COLORS.Open) + ';" onchange="dpSetTaskState(\'' + t.id + '\', this.value, \'' + viewedDateKey + '\')">' + dpTaskStateOptions(t.taskState || 'Open') + '</select>' +
                '<select class="dp-task-status" style="background-color:' + bg + ';color:' + color + ';" onchange="dpSetTaskStatus(\'' + t.id + '\', this.value)">' + dpTaskStatusOptions(data, t.status) + '</select>' +
                '<div class="dp-task-del" onclick="dpDeleteTask(\'' + t.id + '\')">&times;</div>' +
            '</div>' +
            '<div class="dp-task-dates">' +
                '<div class="dp-date-chip dp-date-chip-start"><span class="dp-date-chip-icon">' + DP_ICON_CALENDAR + '</span><span class="dp-date-chip-label">Start</span><span class="dp-date-chip-value dp-date-chip-value-editable" onclick="dpOpenDateChipPicker(this)">' + (t.startDate ? dpFormatDate(t.startDate) : '—') + '</span><input type="date" class="dp-date-chip-hidden-input" value="' + (t.startDate || '') + '"' + (t.expectedCloseDate ? ' max="' + t.expectedCloseDate + '"' : '') + ' onchange="dpSetTaskDate(\'' + t.id + '\',\'startDate\',this.value)"></div>' +
                '<div class="dp-date-chip dp-date-chip-expected"><span class="dp-date-chip-icon">' + DP_ICON_CALENDAR + '</span><span class="dp-date-chip-label">Expected</span><span class="dp-date-chip-value dp-date-chip-value-editable" onclick="dpOpenDateChipPicker(this)">' + (t.expectedCloseDate ? dpFormatDate(t.expectedCloseDate) : '—') + '</span><input type="date" class="dp-date-chip-hidden-input" value="' + (t.expectedCloseDate || '') + '"' + (t.startDate ? ' min="' + t.startDate + '"' : '') + ' onchange="dpSetTaskDate(\'' + t.id + '\',\'expectedCloseDate\',this.value)"></div>' +
                '<div class="dp-date-chip' + (t.closedDate ? ' dp-date-chip-actual-set' : ' dp-date-chip-actual-empty') + '"><span class="dp-date-chip-icon">' + DP_ICON_CHECK + '</span><span class="dp-date-chip-label">Closed</span><span class="dp-date-chip-value">' + (t.closedDate ? dpFormatDate(t.closedDate) : '—') + '</span></div>' +
            '</div>' +
        '</div>';
    }

    // The My Day list only shows tasks still marked "Me" — once a task's status
    // moves to another team/stage (or Closed), it belongs in the Team Tracker tab
    // instead (see dpRenderTracker).
    function dpRenderTasks() {
        var data = dpLoadData();
        var list = document.getElementById('dpTaskList');
        if (!list) return;
        var startDefaultInput = document.getElementById('dpNewTaskStart');
        if (startDefaultInput && document.activeElement !== startDefaultInput) {
            startDefaultInput.value = dpSelectedDate;
            dpSyncNewTaskExpectedMin(dpSelectedDate);
        }
        dpRenderTaskStatusOptions(data);
        dpRenderNewTaskStateOptions();
        var tasks = dpVisibleTasksForDate(data, dpSelectedDate).filter(function (t) { return t.status === 'Me'; });
        var dateObj = new Date(dpSelectedDate + 'T00:00:00');
        var heading = document.getElementById('dpSelectedDateLabel');
        if (heading) heading.textContent = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        dpRenderStats();
        if (!tasks.length) {
            list.innerHTML = '<div class="dp-empty"><div class="dp-empty-icon-wrap" style="background:#EFF6FF;"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2979d4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div><div>No personal tasks planned for this day yet. Add one above — tasks assigned to another team show in the Team Tracker tab.</div></div>';
            return;
        }
        list.innerHTML = tasks.map(function (t) { return dpTaskRowHtml(t, data, dpSelectedDate); }).join('');
    }

    // Core task-creation logic, shared by the DOM-driven "+ Add Task" form and
    // the Day Planner Agent's programmatic task creation. Returns the new id.
    function dpCreateTask(opts) {
        var data = dpLoadData();
        var newTaskId = 'tk_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        data.taskList.push({
            id: newTaskId,
            title: opts.title, description: opts.description || '', time: opts.time || '',
            startDate: opts.startDate || dpSelectedDate,
            expectedCloseDate: opts.expectedCloseDate || null,
            status: opts.status || 'Me', closedDate: null,
            assignee: opts.assignee || '',
            taskState: opts.taskState || 'Open'
        });
        dpLogAudit(data, 'Task created', 'Created "' + opts.title + '" (Task Owner: ' + (opts.status || 'Me') + ', Status: ' + (opts.taskState || 'Open') + ').');
        dpSaveData(data);
        wfRunTriggers('Task Added', { taskId: newTaskId });
        dpRenderTasks();
        dpRenderTracker();
        dpRenderDateStrip();
        dashRenderMyTasks();
        return newTaskId;
    }
    // Populates the Add Task form's status <select> — same options as a task row's
    // own status dropdown (dpTaskStatusOptions: Me/At Product/.../Closed + customs).
    // Pass forceStatus to reset the selection (used when the form is freshly opened
    // from My Day vs. Team Tracker); omit it to just refresh options in place while
    // preserving whatever the user currently has picked.
    function dpRenderTaskStatusOptions(data, forceStatus) {
        var sel = document.getElementById('dpNewTaskStatus');
        if (!sel) return;
        var current = forceStatus || ((sel.value && sel.value !== '__add_new__') ? sel.value : 'Me');
        sel.innerHTML = dpTaskStatusOptions(data, current);
        dpUpdateNewTaskStatusDot(current);
    }
    // Populates the Add Task form's separate "Status" (Open/Hold/Closed) select —
    // always defaults back to "Open" for a freshly-opened form.
    function dpRenderNewTaskStateOptions() {
        var sel = document.getElementById('dpNewTaskState');
        if (!sel) return;
        var current = (sel.value && DP_TASK_STATE_VALUES.indexOf(sel.value) !== -1) ? sel.value : 'Open';
        sel.innerHTML = dpTaskStateOptions(current);
    }
    // Live visual feedback on the Add Task drawer: the small dot next to the Status
    // label and the thin accent bar across the drawer's top both track the selected
    // status's color, updating immediately as the user changes the dropdown.
    function dpUpdateNewTaskStatusDot(status) {
        var color = DP_TASK_STATUS_COLORS[status] || DP_TASK_STATUS_DEFAULT_COLOR;
        var dot = document.getElementById('dpNewTaskStatusDot');
        if (dot) dot.style.background = color;
        var accent = document.getElementById('dpNewTaskDrawerAccent');
        if (accent) accent.style.background = color;
    }
    // Handles "+ Add new status…" inside the Add Task form (the task doesn't exist
    // yet, so this only persists the new status and re-picks it) against
    // DP_TASK_STATUSES/customTaskStatuses.
    window.dpNewTaskStatusChange = function (sel) {
        if (sel.value !== '__add_new__') return;
        var data = dpLoadData();
        var name = window.prompt('Name the new status:');
        if (!name || !name.trim()) { dpRenderTaskStatusOptions(data); return; }
        name = name.trim();
        if (!data.customTaskStatuses) data.customTaskStatuses = [];
        var known = DP_TASK_STATUSES.concat(data.customTaskStatuses);
        if (known.indexOf(name) === -1) { data.customTaskStatuses.push(name); dpSaveData(data); }
        dpRenderTaskStatusOptions(data, name);
        sel.value = name;
    };
    // The single "+ Add Task"/"+ Track Task" form: which tab a task lands in is
    // decided purely by its status (Me -> My Day, anything else -> Team Tracker,
    // via dpVisibleTasksForDate/dpRenderTracker) — there's no separate creation path.
    // Task title, Start date, Task Owner, and Status are mandatory — this validates
    // all four together (rather than failing silently on the first empty one) so the
    // user sees everything they still need to fill in, highlighted, in one pass.
    window.dpAddTask = function () {
        var input = document.getElementById('dpNewTaskInput');
        var startInput = document.getElementById('dpNewTaskStart');
        var expectedInput = document.getElementById('dpNewTaskExpected');
        var descInput = document.getElementById('dpNewTaskDesc');
        var statusInput = document.getElementById('dpNewTaskStatus');
        var stateInput = document.getElementById('dpNewTaskState');
        if (!input) return;

        var fields = [
            { el: input, label: 'Task title', value: input.value.trim() },
            { el: startInput, label: 'Start date', value: startInput ? startInput.value : '' },
            { el: statusInput, label: 'Task Owner', value: (statusInput && statusInput.value !== '__add_new__') ? statusInput.value : '' },
            { el: stateInput, label: 'Status', value: stateInput ? stateInput.value : '' }
        ];
        fields.forEach(function (f) { if (f.el) f.el.classList.remove('dp-input-invalid'); });
        var missing = fields.filter(function (f) { return !f.value; });
        if (missing.length) {
            missing.forEach(function (f) { if (f.el) f.el.classList.add('dp-input-invalid'); });
            window.alert('Please fill in: ' + missing.map(function (f) { return f.label; }).join(', ') + '.');
            missing[0].el.focus();
            return;
        }

        var title = fields[0].value, startVal = fields[1].value, statusVal = fields[2].value, stateVal = fields[3].value;
        var expectedVal = (expectedInput && expectedInput.value) ? expectedInput.value : null;
        if (!dpDatesValid(startVal, expectedVal)) {
            window.alert('Expected closure date cannot be before the start date.');
            return;
        }
        dpCreateTask({
            title: title,
            description: descInput ? descInput.value.trim() : '',
            startDate: startVal,
            expectedCloseDate: expectedVal,
            status: statusVal,
            taskState: stateVal
        });
        input.value = '';
        if (descInput) descInput.value = '';
        if (expectedInput) expectedInput.value = '';
        if (startInput) startInput.value = dpSelectedDate;
        dpSyncNewTaskExpectedMin(dpSelectedDate);
        closeAddTaskModal();
    };
    // defaultStatus: 'Me' when opened from My Day's "+ Add Task", or a non-Me status
    // (e.g. 'At Product') when opened from Team Tracker's "+ Track Task" — the only
    // difference between the two entry points, since it's the same form either way.
    window.openAddTaskModal = function (defaultStatus) {
        var modal = document.getElementById('dpAddTaskModal');
        var backdrop = document.getElementById('dpAddTaskBackdrop');
        if (!modal) return;
        modal.querySelectorAll('.dp-input-invalid').forEach(function (el) { el.classList.remove('dp-input-invalid'); });
        var startInput = document.getElementById('dpNewTaskStart');
        if (startInput && !startInput.value) startInput.value = dpSelectedDate;
        dpSyncNewTaskExpectedMin(startInput ? startInput.value : '');
        var data = dpLoadData();
        dpRenderTaskStatusOptions(data, defaultStatus || 'Me');
        var stateSel = document.getElementById('dpNewTaskState');
        if (stateSel) stateSel.innerHTML = dpTaskStateOptions('Open');
        if (backdrop) backdrop.style.display = 'block';
        modal.style.display = 'flex';
        // Force layout before adding the open class so the slide-in transition
        // actually plays instead of the drawer just appearing already open.
        modal.getBoundingClientRect();
        modal.classList.add('dp-drawer-open');
        setTimeout(function () {
            var input = document.getElementById('dpNewTaskInput');
            if (input) input.focus();
        }, 50);
    };
    window.closeAddTaskModal = function () {
        var modal = document.getElementById('dpAddTaskModal');
        var backdrop = document.getElementById('dpAddTaskBackdrop');
        if (!modal) return;
        modal.classList.remove('dp-drawer-open');
        if (backdrop) backdrop.style.display = 'none';
        setTimeout(function () { modal.style.display = 'none'; }, 220);
    };

    // Renders the Audit Log drawer's entry list, newest first (already the storage
    // order — see dpLogAudit). Each entry is a plain-language sentence describing
    // one create/change/delete across My Day tasks and Team Tracker items.
    var DP_AUDIT_ACTION_COLORS = {
        'Task created': '#16a34a', 'Task deleted': '#e24b4a', 'Task Owner changed': '#4f46e5',
        'Status changed': '#d97706', 'Date changed': '#2979d4',
        'Item tracked': '#16a34a', 'Tracked item deleted': '#e24b4a', 'Tracked item status changed': '#d97706'
    };
    function dpRenderAuditLog() {
        var body = document.getElementById('dpAuditLogBody');
        if (!body) return;
        var data = dpLoadData();
        var entries = data.auditLog || [];
        if (!entries.length) {
            body.innerHTML = '<div class="dp-empty"><div class="dp-empty-icon-wrap" style="background:#F1F5F9;"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div><div>No activity yet — every task and tracked-item change will show up here.</div></div>';
            return;
        }
        body.innerHTML = entries.map(function (e) {
            var color = DP_AUDIT_ACTION_COLORS[e.action] || '#94a3b8';
            var time = new Date(e.ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
            return '<div class="dp-audit-entry">' +
                '<div class="dp-audit-entry-dot" style="background:' + color + ';"></div>' +
                '<div class="dp-audit-entry-body">' +
                    '<div class="dp-audit-entry-top"><span class="dp-audit-entry-action">' + dpEsc(e.action) + '</span><span class="dp-audit-entry-time">' + time + '</span></div>' +
                    '<div class="dp-audit-entry-detail">' + dpEsc(e.detail) + '</div>' +
                '</div>' +
            '</div>';
        }).join('');
    }
    window.openAuditLogDrawer = function () {
        var drawer = document.getElementById('dpAuditLogDrawer');
        var backdrop = document.getElementById('dpAuditLogBackdrop');
        if (!drawer) return;
        dpRenderAuditLog();
        if (backdrop) backdrop.style.display = 'block';
        drawer.style.display = 'flex';
        drawer.getBoundingClientRect();
        drawer.classList.add('dp-drawer-open');
    };
    window.closeAuditLogDrawer = function () {
        var drawer = document.getElementById('dpAuditLogDrawer');
        var backdrop = document.getElementById('dpAuditLogBackdrop');
        if (!drawer) return;
        drawer.classList.remove('dp-drawer-open');
        if (backdrop) backdrop.style.display = 'none';
        setTimeout(function () { drawer.style.display = 'none'; }, 220);
    };
    window.dpDeleteTask = function (id) {
        var data = dpLoadData();
        var t = (data.taskList || []).find(function (x) { return x.id === id; });
        if (t) dpLogAudit(data, 'Task deleted', 'Deleted "' + t.title + '".');
        data.taskList = (data.taskList || []).filter(function (x) { return x.id !== id; });
        dpSaveData(data);
        dpRenderTasks();
        dpRenderTracker();
        dpRenderDateStrip();
        dashRenderMyTasks();
    };

    // ── Team Tracker: tasks owned by other teams, no dependency on the user ────
    // Task creation is unified with My Day — the same "+ Add Task" form (opened via
    // "+ Track Task" here, defaulting its status to a non-"Me" value) creates a real
    // dp_tasks row; which tab it shows in is decided purely by status (dpRenderTasks
    // filters to "Me", dpRenderTracker below to everything else). Legacy items from
    // data.tracker (created before this, or by the Day Planner Agent's tracking
    // tool) still render here too via dpTrackerRowHtml, merged into the same list.
    // The filter pills use the My Day status vocabulary (DP_TASK_STATUSES minus
    // "Me", plus any custom statuses) since that's what real tasks carry; a legacy
    // tracker item only matches a pill if its own status happens to equal it.
    var dpTrackerFilter = 'all';
    window.dpSetTrackerFilter = function (f) {
        dpTrackerFilter = f;
        dpRenderTracker();
    };
    function dpRenderTrackerFilters() {
        var row = document.getElementById('dpTrackerFilterRow');
        if (!row) return;
        var data = dpLoadData();
        var statuses = DP_TASK_STATUSES.filter(function (s) { return s !== 'Me'; }).concat(data.customTaskStatuses || []);
        var options = [{ id: 'all', label: 'All' }].concat(statuses.map(function (s) { return { id: s, label: s }; }));
        row.innerHTML = options.map(function (o) {
            var active = o.id === dpTrackerFilter;
            var dot = o.id !== 'all' ? '<span class="dp-filter-dot" style="background:' + (DP_TASK_STATUS_COLORS[o.id] || DP_TASK_STATUS_DEFAULT_COLOR) + ';"></span>' : '';
            return '<button type="button" class="dp-filter-pill' + (active ? ' dp-filter-pill-active' : '') + '" onclick="dpSetTrackerFilter(\'' + o.id + '\')">' + dot + o.label + '</button>';
        }).join('');
    }

    // Renders one manually-tracked item using the exact same card shell as a My Day
    // task row (dpTaskRowHtml) — border-left accent, title/notes block, assignee +
    // status selects, delete button, and a date-chips row (here showing the owning
    // Team and Due date as static chips) — so it's visually indistinguishable from
    // a task that moved here from My Day, even though the two stay separate records
    // with their own status vocabularies under the hood.
    function dpTrackerRowHtml(t, data) {
        var color = DP_STATUS_COLORS[t.status] || '#94a3b8';
        var bg = DP_STATUS_BG[t.status] || '#F8FAFC';
        var statusOpts = DP_STATUS_OPTIONS.map(function (s) {
            return '<option' + (s === t.status ? ' selected' : '') + '>' + s + '</option>';
        }).join('');
        return '<div class="dp-task-row" style="border-left-color:' + color + ';">' +
            '<div class="dp-task-top">' +
                '<div class="dp-task-text">' +
                    '<div class="dp-task-title">' + dpEsc(t.title) + '</div>' +
                    (t.notes ? '<div class="dp-task-desc">' + dpEsc(t.notes) + '</div>' : '') +
                '</div>' +
                '<select class="dp-task-status" style="background-color:' + bg + ';color:' + color + ';" onchange="dpUpdateTrackerStatus(\'' + t.id + '\', this.value)">' + statusOpts + '</select>' +
                '<div class="dp-task-del" onclick="dpDeleteTracker(\'' + t.id + '\')">&times;</div>' +
            '</div>' +
            '<div class="dp-task-dates">' +
                '<div class="dp-date-chip dp-date-chip-actual-set"><span class="dp-date-chip-icon">' + DP_ICON_CALENDAR + '</span><span class="dp-date-chip-label">Team</span><span class="dp-date-chip-value">' + dpEsc(t.team) + '</span></div>' +
                '<div class="dp-date-chip' + (t.dueDate ? ' dp-date-chip-actual-set' : ' dp-date-chip-actual-empty') + '"><span class="dp-date-chip-icon">' + DP_ICON_CALENDAR + '</span><span class="dp-date-chip-label">Due</span><span class="dp-date-chip-value">' + (t.dueDate ? dpFormatDate(t.dueDate) : '—') + '</span></div>' +
            '</div>' +
        '</div>';
    }

    // Team Tracker shows one merged, alphabetized list: real tasks whose status
    // isn't "Me" (dpVisibleTasksForDate — the primary path, created via the same
    // form as My Day) alongside any legacy manually-tracked items (data.tracker) —
    // rendered with the identical dp-task-row shell so there's no visual split.
    // The active filter pill matches against each item's own status field, whatever
    // vocabulary it belongs to.
    function dpRenderTracker() {
        var data = dpLoadData();
        dpRenderStats();
        dpRenderTrackerFilters();
        dpRenderTaskStatusOptions(data);
        dpRenderNewTaskStateOptions();

        var todayKey = dpToDateKey(new Date());
        var teamTasks = dpVisibleTasksForDate(data, todayKey).filter(function (t) { return t.status !== 'Me' && (dpTrackerFilter === 'all' || t.status === dpTrackerFilter); });
        var trackerItems = (data.tracker || []).filter(function (t) { return dpTrackerFilter === 'all' || t.status === dpTrackerFilter; });

        var countEl = document.getElementById('dpTrackerCount');
        if (countEl) countEl.textContent = teamTasks.length + trackerItems.length;

        var list = document.getElementById('dpTrackerCombinedList');
        if (!list) return;
        if (!teamTasks.length && !trackerItems.length) {
            list.innerHTML = '<div class="dp-empty"><div class="dp-empty-icon-wrap" style="background:#FFFBEB;"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="7" r="3"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><circle cx="17" cy="7" r="3"/><path d="M21 21v-2a4 4 0 0 0-3-3.85"/></svg></div><div>' +
                ((data.tracker || []).length ? 'No items match this filter.' : 'Nothing here yet — tasks moved to another team/stage show up automatically, or add one you\'re manually tracking above.') + '</div></div>';
            return;
        }
        var combined = teamTasks.map(function (t) { return { title: t.title, html: dpTaskRowHtml(t, data, todayKey) }; })
            .concat(trackerItems.map(function (t) { return { title: t.title, html: dpTrackerRowHtml(t, data) }; }));
        combined.sort(function (a, b) { return a.title.localeCompare(b.title); });
        list.innerHTML = combined.map(function (c) { return c.html; }).join('');
    }

    // Legacy tracker-item creation — no longer reachable from the UI (the "+ Track
    // Task" button now opens the same form as "+ Add Task", creating a real task
    // instead), kept only because the Day Planner Agent's tracking tool still calls
    // it. Existing/agent-created items keep rendering via dpTrackerRowHtml above.
    function dpCreateTrackerItem(opts) {
        var data = dpLoadData();
        var newId = 'tr_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        data.tracker.push({
            id: newId,
            title: opts.title,
            team: opts.team || 'Other Team',
            status: opts.status || 'Pending',
            dueDate: opts.dueDate || '',
            notes: opts.notes || '',
            assignee: opts.assignee || ''
        });
        dpLogAudit(data, 'Item tracked', 'Started tracking "' + opts.title + '" (' + (opts.team || 'Other Team') + ').');
        dpSaveData(data);
        dpRenderTracker();
        return newId;
    }
    window.dpUpdateTrackerStatus = function (id, status) {
        var data = dpLoadData();
        var t = data.tracker.find(function (x) { return x.id === id; });
        if (t) {
            dpLogAudit(data, 'Tracked item status changed', 'Set status for "' + t.title + '" from "' + t.status + '" to "' + status + '".');
            t.status = status;
            dpSaveData(data);
            dpRenderTracker();
        }
    };
    window.dpDeleteTracker = function (id) {
        var data = dpLoadData();
        var t = data.tracker.find(function (x) { return x.id === id; });
        if (t) dpLogAudit(data, 'Tracked item deleted', 'Deleted tracked item "' + t.title + '".');
        data.tracker = data.tracker.filter(function (x) { return x.id !== id; });
        dpSaveData(data);
        dpRenderTracker();
    };

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            var datePicker = document.getElementById('dpDatePickerPopover');
            if (datePicker && datePicker.style.display !== 'none') { dpToggleDatePicker(); return; }
            var addModal = document.getElementById('dpAddTaskModal');
            if (addModal && addModal.style.display !== 'none') { closeAddTaskModal(); return; }
            var auditDrawer = document.getElementById('dpAuditLogDrawer');
            if (auditDrawer && auditDrawer.style.display !== 'none') { closeAuditLogDrawer(); return; }
            var wfDesigner = document.getElementById('workflow-designer-overlay');
            if (wfDesigner && wfDesigner.style.display !== 'none') { closeWorkflowEditor(); return; }
            var wfList = document.getElementById('workflow-overlay');
            if (wfList && wfList.style.display !== 'none') { closeWorkflowBuilder(); return; }
            var overlay = document.getElementById('day-planner-overlay');
            if (overlay && overlay.style.display !== 'none') closeDayPlanner();
        }
    });

    // ── Dashboard "My Tasks" widget ─────────────────────────────────────────────
    // Shares the same localStorage-backed store as the Day Planner (today's date
    // bucket), so adding/checking off a task here or in the Day Planner stays in
    // sync. Only tasks still marked "Me" show here — once a task's status moves to
    // another team/stage (or Closed), it drops off this widget and shows under the
    // "Team" group in the Day Planner's My Day list instead.
    function dashRenderMyTasks() {
        var list = document.getElementById('dashMyTasksList');
        if (!list) return;
        var data = dpLoadData();
        var todayKey = dpToDateKey(new Date());
        var tasks = dpVisibleTasksForDate(data, todayKey).filter(function (t) { return t.status === 'Me'; });
        var counterEl = document.getElementById('dashMyTasksCounter');
        if (counterEl) counterEl.textContent = tasks.length ? String(tasks.length) : '';
        if (!tasks.length) {
            list.innerHTML = '<div class="task-item"><div class="task-text" style="color:#b8bec7;">No personal tasks for today. Add one below.</div></div>';
            return;
        }
        list.innerHTML = tasks.map(function (t) {
            var isClosed = t.taskState === 'Closed';
            var color = DP_TASK_STATUS_COLORS[t.status] || DP_TASK_STATUS_DEFAULT_COLOR;
            var bg = DP_TASK_STATUS_BG[t.status] || DP_TASK_STATUS_DEFAULT_BG;
            return '<div class="dtask-row">' +
                '<div class="task-text' + (isClosed ? ' dtask-done-text' : '') + '" style="flex:1;">' + dpEsc(t.title) + '</div>' +
                '<select class="dp-task-status dp-task-status-sm" style="background-color:' + bg + ';color:' + color + ';" onchange="dpSetTaskStatus(\'' + t.id + '\', this.value)">' + dpTaskStatusOptions(data, t.status) + '</select>' +
                '<div class="dtask-del" onclick="dashDeleteQuickTask(\'' + t.id + '\')">&times;</div>' +
            '</div>';
        }).join('');
    }

    window.dashAddQuickTask = function () {
        var input = document.getElementById('dashQuickTaskInput');
        if (!input) return;
        var title = input.value.trim();
        if (!title) return;
        var data = dpLoadData();
        var todayKey = dpToDateKey(new Date());
        var newTaskId = 'tk_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        data.taskList.push({
            id: newTaskId,
            title: title, description: '', time: '', startDate: todayKey, expectedCloseDate: null, status: 'Me', closedDate: null
        });
        dpSaveData(data);
        wfRunTriggers('Task Added', { taskId: newTaskId });
        input.value = '';
        dashRenderMyTasks();
        dpRenderDateStrip();
        if (dpSelectedDate === todayKey) dpRenderTasks();
    };
    window.dashDeleteQuickTask = function (id) {
        var data = dpLoadData();
        data.taskList = (data.taskList || []).filter(function (x) { return x.id !== id; });
        dpSaveData(data);
        dashRenderMyTasks();
        dpRenderDateStrip();
        var todayKey = dpToDateKey(new Date());
        if (dpSelectedDate === todayKey) dpRenderTasks();
    };

    // Hydrate both caches from the backend on load (no more local demo seeding —
    // My Day/Team Tracker/Workflow Builder now start from whatever is actually
    // persisted in Postgres, or empty if there's nothing there yet / the backend
    // is unreachable). Both must finish before wfProcessPendingRuns() runs: a due
    // "Wait" step can mutate Day Planner tasks, and since dpSaveData() persists
    // the *whole* task list, running it against an unhydrated (empty) DP cache
    // would overwrite real data with just the resumed step's change.
    document.addEventListener('DOMContentLoaded', function () {
        Promise.all([dpLoadRemote(), wfLoadRemote()]).then(function () {
            wfProcessPendingRuns();
            dashRenderMyTasks();
        });
    });

    /* ═══════════════════════════════════════
       WORKFLOW BUILDER
       Lets the user configure "when X happens in the Day Planner, do Y then Z"
       automations — a trigger tied to My Day task events plus an ordered list
       of steps that act on those same tasks. Its own page, reached via the
       "Workflows" CTA on the Day Planner page. Persisted to Postgres via
       /api/workflows, and — unlike a purely cosmetic
       mock — active workflows actually run: wfRunTriggers() is called from
       dpAddTask/dashAddQuickTask (trigger "Task Added") and dpSetTaskStatus
       (triggers "Task Status Changed", "Task Closed", "Task Moved to Team"),
       and each step directly edits the Day Planner's task data.
    ═══════════════════════════════════════ */
    var WF_STORAGE_KEY = 'workflowBuilderData_v1';
    var WF_TRIGGERS = ['Task Added', 'Task Status Changed', 'Task Closed', 'Task Moved to Team'];
    var WF_STEP_TYPES = ['Add Follow-up Task', 'Set Status To', 'Set Expected Closure (+days)', 'Wait (days)', 'Show Notification'];
    var WF_STEP_PLACEHOLDERS = {
        'Add Follow-up Task': 'Heading for the new task…',
        'Set Status To': 'e.g. In Dev, At CS, At Ops…',
        'Set Expected Closure (+days)': 'Days from now, e.g. 2',
        'Wait (days)': 'Days to wait, e.g. 2',
        'Show Notification': 'Message to log…'
    };
    var wfEditingId = null;   // id of the workflow being edited, null while creating a new one
    var wfDraftSteps = [];    // steps currently in the editor modal, not yet saved

    // Same write-through cache pattern as Day Planner's dpLoadData/dpSaveData —
    // see the comment above those. Workflow data lives in Postgres (wf_workflows /
    // wf_steps / wf_log / wf_pending_runs, via /api/workflows).
    var WF_REMOTE_CACHE = null;
    function wfLoadData() {
        if (WF_REMOTE_CACHE) return WF_REMOTE_CACHE;
        return { workflows: [], log: [], pending: [] };
    }
    function wfSetLocalCache(data) {
        if (!data.workflows) data.workflows = [];
        if (!data.log) data.log = [];
        if (!data.pending) data.pending = [];
        WF_REMOTE_CACHE = data;
        try { localStorage.setItem(WF_STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
    }
    function wfSaveData(data) {
        wfSetLocalCache(data);
        fetch(API_BASE + '/api/workflows', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(function (e) { /* offline-safe — local cache is already updated */ });
    }
    // Same in-flight coalescing as dpLoadRemote above.
    var _wfLoadRemotePromise = null;
    function wfLoadRemote() {
        if (_wfLoadRemotePromise) return _wfLoadRemotePromise;
        _wfLoadRemotePromise = fetch(API_BASE + '/api/workflows')
            .then(function (r) { return r.json(); })
            .then(function (res) {
                wfSetLocalCache({
                    workflows: (res && res.workflows) || [],
                    log: (res && res.log) || [],
                    pending: (res && res.pending) || []
                });
            })
            .catch(function (e) {
                wfSetLocalCache({ workflows: [], log: [], pending: [] });
            })
            .finally(function () { _wfLoadRemotePromise = null; });
        return _wfLoadRemotePromise;
    }

    // Runs w.steps starting at startIndex, mutating dpData/wfData in place. Stops
    // at the first "Wait (days)" step and schedules a pending resume instead of
    // blocking — there's no real background scheduler, so the wait is honored by
    // wfProcessPendingRuns() checking again on a later page load, once the target
    // date has arrived. Steps mutate Day Planner data directly (not through
    // dpSetTaskStatus/dpAddTask) so a step can never re-fire another trigger —
    // that keeps every pass safe, with no risk of automation loops.
    function wfExecuteSteps(w, startIndex, ctx, dpData, wfData) {
        var todayKey = dpToDateKey(new Date());
        var steps = w.steps || [];
        var result = { dpChanged: false, wfDataChanged: false };
        for (var i = startIndex; i < steps.length; i++) {
            var step = steps[i];
            if (step.type === 'Wait (days)') {
                var waitDays = parseInt(step.detail, 10);
                if (!isNaN(waitDays) && waitDays > 0) {
                    var resumeDate = new Date();
                    resumeDate.setDate(resumeDate.getDate() + waitDays);
                    wfData.pending.push({
                        id: 'pend_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                        workflowId: w.id,
                        workflowName: w.name,
                        taskId: ctx.taskId || null,
                        resumeAt: dpToDateKey(resumeDate),
                        nextStepIndex: i + 1
                    });
                    result.wfDataChanged = true;
                    return result;
                }
                continue; // zero/invalid wait — treat as a no-op and keep going
            } else if (step.type === 'Add Follow-up Task') {
                dpData.taskList.push({
                    id: 'tk_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                    title: step.detail || 'Follow-up task',
                    description: 'Auto-created by workflow "' + w.name + '"',
                    time: '', startDate: todayKey, expectedCloseDate: null, status: 'Me', closedDate: null
                });
                result.dpChanged = true;
            } else if (step.type === 'Set Status To' && ctx.taskId && step.detail) {
                var t1 = dpData.taskList.find(function (x) { return x.id === ctx.taskId; });
                if (t1) {
                    t1.status = step.detail;
                    result.dpChanged = true;
                }
            } else if (step.type === 'Set Expected Closure (+days)' && ctx.taskId) {
                var t2 = dpData.taskList.find(function (x) { return x.id === ctx.taskId; });
                var eDays = parseInt(step.detail, 10);
                if (t2 && !isNaN(eDays)) {
                    var ed = new Date();
                    ed.setDate(ed.getDate() + eDays);
                    t2.expectedCloseDate = dpToDateKey(ed);
                    result.dpChanged = true;
                }
            } else if (step.type === 'Show Notification') {
                wfData.log.unshift({ ts: Date.now(), message: step.detail || ('Workflow "' + w.name + '" ran') });
                wfData.log = wfData.log.slice(0, 20);
                result.wfDataChanged = true;
            }
        }
        return result;
    }

    // Runs every active workflow whose trigger matches triggerName against the
    // task in ctx.taskId (called from dpAddTask/dpSetTaskStatus).
    function wfRunTriggers(triggerName, ctx) {
        var wfData = wfLoadData();
        var matched = wfData.workflows.filter(function (w) { return w.active && w.trigger === triggerName; });
        if (!matched.length) return;
        var dpData = dpLoadData();
        var dpChanged = false, wfDataChanged = false;
        matched.forEach(function (w) {
            var result = wfExecuteSteps(w, 0, ctx, dpData, wfData);
            if (result.dpChanged) dpChanged = true;
            if (result.wfDataChanged) wfDataChanged = true;
        });
        if (dpChanged) dpSaveData(dpData);
        if (wfDataChanged) wfSaveData(wfData);
    }

    // Resumes any pending "Wait" runs whose resumeAt date has arrived. Called on
    // every page load (and whenever the Workflow Builder or Day Planner opens)
    // since nothing here runs in the background between visits.
    function wfProcessPendingRuns() {
        var wfData = wfLoadData();
        if (!wfData.pending.length) return;
        var todayKey = dpToDateKey(new Date());
        var due = wfData.pending.filter(function (p) { return p.resumeAt <= todayKey; });
        if (!due.length) return;
        var dpData = dpLoadData();
        var dpChanged = false;
        due.forEach(function (p) {
            var w = wfData.workflows.find(function (x) { return x.id === p.workflowId; });
            if (!w || !w.active) return;
            var result = wfExecuteSteps(w, p.nextStepIndex, { taskId: p.taskId }, dpData, wfData);
            if (result.dpChanged) dpChanged = true;
        });
        // Drop the entries just processed; any fresh entry wfExecuteSteps pushed
        // above (a resumed run hitting another Wait) always has a future resumeAt,
        // so it survives this filter untouched.
        wfData.pending = wfData.pending.filter(function (p) { return p.resumeAt > todayKey; });
        if (dpChanged) dpSaveData(dpData);
        wfSaveData(wfData);
    }

    // The Workflow Builder is its own full page (like Day Planner/METS), opened
    // via the "Workflows" CTA on the Day Planner page rather than a tab inside it.
    var _wfObserver = null;
    function _syncWfLeft() {
        var sb = document.getElementById('sidebar');
        var overlay = document.getElementById('workflow-overlay');
        if (sb && overlay) overlay.style.left = sb.getBoundingClientRect().width + 'px';
    }
    window.openWorkflowBuilder = function () {
        var mets = document.getElementById('mets-overlay');
        if (mets && mets.style.display !== 'none' && window.closeMetsOverlay) closeMetsOverlay();
        var dayPlanner = document.getElementById('day-planner-overlay');
        if (dayPlanner && dayPlanner.style.display !== 'none' && window.closeDayPlanner) closeDayPlanner();
        var commLog = document.getElementById('comm-log-overlay');
        if (commLog && commLog.style.display !== 'none' && window.closeCommLog) closeCommLog();
        var commDetail = document.getElementById('comm-detail-overlay');
        if (commDetail && commDetail.style.display !== 'none' && window.closeCommDetail) closeCommDetail();
        var settingsView = document.getElementById('settings-view');
        if (settingsView && settingsView.classList.contains('open')) settingsView.classList.remove('open');
        var designer = document.getElementById('workflow-designer-overlay');
        if (designer) designer.style.display = 'none';
        var overlay = document.getElementById('workflow-overlay');
        if (!overlay) return;
        _syncWfLeft();
        overlay.style.display = 'block';
        var sb = document.getElementById('sidebar');
        if (sb && window.ResizeObserver && !_wfObserver) {
            _wfObserver = new ResizeObserver(_syncWfLeft);
            _wfObserver.observe(sb);
        }
        wfProcessPendingRuns();
        wfRenderList();
    };
    window.closeWorkflowBuilder = function () {
        var overlay = document.getElementById('workflow-overlay');
        if (overlay) overlay.style.display = 'none';
        if (_wfObserver) { _wfObserver.disconnect(); _wfObserver = null; }
    };

    function wfRenderStats(data) {
        var totalEl = document.getElementById('wfStatTotal');
        var activeEl = document.getElementById('wfStatActive');
        var stepsEl = document.getElementById('wfStatSteps');
        if (totalEl) totalEl.textContent = data.workflows.length;
        if (activeEl) activeEl.textContent = data.workflows.filter(function (w) { return w.active; }).length;
        if (stepsEl) stepsEl.textContent = data.workflows.reduce(function (sum, w) { return sum + w.steps.length; }, 0);
    }

    function wfRenderLog(data) {
        var container = document.getElementById('wfLogList');
        if (!container) return;
        if (!data.log || !data.log.length) {
            container.innerHTML = '<div class="dp-empty-inline">No automation activity yet.</div>';
            return;
        }
        container.innerHTML = data.log.map(function (entry) {
            var d = new Date(entry.ts);
            var timeStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            return '<div class="wf-step-row" style="background:#fff;">' +
                '<div class="wf-step-body" style="align-items:center;">' +
                    '<div style="font-size:12.5px;color:#334155;">' + dpEsc(entry.message) + '</div>' +
                '</div>' +
                '<div style="font-size:11px;color:#94a3b8;flex-shrink:0;white-space:nowrap;">' + timeStr + '</div>' +
            '</div>';
        }).join('');
    }

    function wfRenderPending(data) {
        var container = document.getElementById('wfPendingList');
        if (!container) return;
        if (!data.pending.length) {
            container.innerHTML = '<div class="dp-empty-inline">Nothing waiting right now.</div>';
            return;
        }
        var sorted = data.pending.slice().sort(function (a, b) { return a.resumeAt < b.resumeAt ? -1 : 1; });
        container.innerHTML = sorted.map(function (p) {
            var w = data.workflows.find(function (x) { return x.id === p.workflowId; });
            var name = w ? w.name : (p.workflowName || 'Workflow');
            return '<div class="wf-step-row" style="background:#fff;">' +
                '<div class="wf-step-num wfd-node-num-wait">&#9203;</div>' +
                '<div class="wf-step-body" style="align-items:center;">' +
                    '<div style="font-weight:600;color:#334155;font-size:12.5px;">' + dpEsc(name) + '</div>' +
                    '<div style="color:#94a3b8;font-size:12.5px;">Resumes ' + dpFormatDate(p.resumeAt) + '</div>' +
                '</div>' +
            '</div>';
        }).join('');
    }

    function wfRenderList() {
        var data = wfLoadData();
        wfRenderStats(data);
        wfRenderPending(data);
        wfRenderLog(data);
        var list = document.getElementById('wfWorkflowList');
        if (!list) return;
        if (!data.workflows.length) {
            list.innerHTML = '<div class="dp-empty"><div class="dp-empty-icon-wrap" style="background:#EEF2FF;"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="6" r="2.5"/><circle cx="19" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M5 8.5V12a2 2 0 0 0 2 2h3"/><path d="M19 8.5V12a2 2 0 0 0-2 2h-3"/></svg></div><div>No workflows yet. Click "+ New Workflow" to automate your first trigger.</div></div>';
            return;
        }
        list.innerHTML = data.workflows.map(function (w) {
            var stepsHtml = w.steps.map(function (s, i) {
                var isWait = s.type === 'Wait (days)';
                return '<div class="wf-step-row" style="background:#fff;">' +
                    '<div class="wf-step-num' + (isWait ? ' wfd-node-num-wait' : '') + '">' + (i + 1) + '</div>' +
                    '<div class="wf-step-body" style="align-items:center;">' +
                        '<div style="font-weight:600;color:#334155;font-size:12.5px;">' + dpEsc(s.type) + '</div>' +
                        (s.detail ? '<div style="color:#64748b;font-size:12.5px;">' + dpEsc(s.detail) + (isWait ? ' day(s)' : '') + '</div>' : '') +
                    '</div>' +
                '</div>';
            }).join('');
            return '<div class="wf-workflow-card">' +
                '<div class="wf-workflow-top">' +
                    '<div>' +
                        '<div class="wf-workflow-name">' + dpEsc(w.name) + '</div>' +
                        '<div class="wf-workflow-meta">' +
                            '<span class="wf-trigger-badge">' + dpEsc(w.trigger) + '</span>' +
                            '<span class="wf-step-count-badge">' + w.steps.length + ' step' + (w.steps.length === 1 ? '' : 's') + '</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="wf-workflow-actions">' +
                        '<button class="wf-status-toggle ' + (w.active ? 'active' : 'paused') + '" onclick="wfToggleActive(\'' + w.id + '\')">' + (w.active ? 'Active' : 'Paused') + '</button>' +
                        '<button class="dp-back-btn" style="padding:6px 12px;font-size:12px;" onclick="openWorkflowEditor(\'' + w.id + '\')">Edit</button>' +
                        '<div class="dp-task-del" onclick="wfDeleteWorkflow(\'' + w.id + '\')">&times;</div>' +
                    '</div>' +
                '</div>' +
                (w.steps.length ? '<div class="wf-step-list">' + stepsHtml + '</div>' : '') +
            '</div>';
        }).join('');
    }

    window.wfToggleActive = function (id) {
        var data = wfLoadData();
        var w = data.workflows.find(function (x) { return x.id === id; });
        if (w) { w.active = !w.active; wfSaveData(data); wfRenderList(); }
    };
    window.wfDeleteWorkflow = function (id) {
        var data = wfLoadData();
        data.workflows = data.workflows.filter(function (x) { return x.id !== id; });
        wfSaveData(data);
        wfRenderList();
    };

    var _wfdObserver = null;
    function _syncWfdLeft() {
        var sb = document.getElementById('sidebar');
        var overlay = document.getElementById('workflow-designer-overlay');
        if (sb && overlay) overlay.style.left = sb.getBoundingClientRect().width + 'px';
    }
    window.openWorkflowEditor = function (id) {
        var overlay = document.getElementById('workflow-designer-overlay');
        if (!overlay) return;
        var listOverlay = document.getElementById('workflow-overlay');
        if (listOverlay) listOverlay.style.display = 'none';
        var titleEl = document.getElementById('wfEditorTitle');
        var nameInput = document.getElementById('wfNameInput');
        var triggerInput = document.getElementById('wfTriggerInput');
        if (id) {
            var data = wfLoadData();
            var w = data.workflows.find(function (x) { return x.id === id; });
            if (!w) return;
            wfEditingId = id;
            if (titleEl) titleEl.textContent = 'Edit Workflow';
            if (nameInput) nameInput.value = w.name;
            if (triggerInput) triggerInput.value = w.trigger;
            wfDraftSteps = w.steps.map(function (s) { return { id: s.id, type: s.type, detail: s.detail }; });
        } else {
            wfEditingId = null;
            if (titleEl) titleEl.textContent = 'New Workflow';
            if (nameInput) nameInput.value = '';
            if (triggerInput) triggerInput.value = WF_TRIGGERS[0];
            wfDraftSteps = [];
        }
        wfdSyncTriggerLabel();
        wfRenderStepsEditor();
        _syncWfdLeft();
        overlay.style.display = 'block';
        var sb = document.getElementById('sidebar');
        if (sb && window.ResizeObserver && !_wfdObserver) {
            _wfdObserver = new ResizeObserver(_syncWfdLeft);
            _wfdObserver.observe(sb);
        }
        setTimeout(function () { if (nameInput) nameInput.focus(); }, 50);
    };
    window.closeWorkflowEditor = function () {
        var overlay = document.getElementById('workflow-designer-overlay');
        if (overlay) overlay.style.display = 'none';
        if (_wfdObserver) { _wfdObserver.disconnect(); _wfdObserver = null; }
        if (window.openWorkflowBuilder) openWorkflowBuilder();
    };
    window.wfdSyncTriggerLabel = function () {
        var sel = document.getElementById('wfTriggerInput');
        var label = document.getElementById('wfdTriggerLabel');
        if (sel && label) label.textContent = sel.value;
    };

    // Renders the drag-and-drop step nodes inside the designer canvas.
    function wfRenderStepsEditor() {
        var container = document.getElementById('wfStepsEditor');
        var emptyHint = document.getElementById('wfdEmptyDropHint');
        if (!container) return;
        if (emptyHint) emptyHint.style.display = wfDraftSteps.length ? 'none' : 'block';
        container.innerHTML = wfDraftSteps.map(function (s, i) {
            var typeOpts = WF_STEP_TYPES.map(function (t) {
                return '<option' + (t === s.type ? ' selected' : '') + '>' + t + '</option>';
            }).join('');
            var placeholder = WF_STEP_PLACEHOLDERS[s.type] || 'Details…';
            var isWait = s.type === 'Wait (days)';
            return '<div class="wfd-connector"></div>' +
                '<div class="wfd-node' + (isWait ? ' wfd-node-wait' : '') + '" draggable="true" data-step-id="' + s.id + '" ondragstart="wfdNodeDragStart(event)" ondragover="wfdNodeDragOver(event)" ondragleave="wfdNodeDragLeave(event)" ondrop="wfdNodeDrop(event)" ondragend="wfdNodeDragEnd(event)">' +
                    '<div class="wfd-node-drag-handle" title="Drag to reorder">&#8942;&#8942;</div>' +
                    '<div class="wfd-node-num' + (isWait ? ' wfd-node-num-wait' : '') + '">' + (isWait ? '&#9203;' : (i + 1)) + '</div>' +
                    '<div class="wfd-node-body">' +
                        '<select class="dp-input wf-step-type-select" style="width:100%;margin-bottom:6px;" onchange="wfUpdateStep(\'' + s.id + '\',\'type\',this.value)">' + typeOpts + '</select>' +
                        '<input type="text" class="dp-input" style="width:100%;" placeholder="' + placeholder + '" value="' + dpEsc(s.detail || '') + '" oninput="wfUpdateStep(\'' + s.id + '\',\'detail\',this.value)">' +
                    '</div>' +
                    '<div class="dp-task-del" onclick="wfDeleteStep(\'' + s.id + '\')">&times;</div>' +
                '</div>';
        }).join('');
    }

    window.wfUpdateStep = function (id, field, value) {
        var s = wfDraftSteps.find(function (x) { return x.id === id; });
        if (s) s[field] = value;
        if (field === 'type') wfRenderStepsEditor();
    };
    window.wfDeleteStep = function (id) {
        wfDraftSteps = wfDraftSteps.filter(function (x) { return x.id !== id; });
        wfRenderStepsEditor();
    };

    // ── Drag-and-drop engine for the workflow designer canvas ──────────────────
    // Two drag sources: a palette chip (adds a new step) and an existing node
    // (reorders it). The payload's "source" field tells drop handlers which.
    function wfdParsePayload(event) {
        try {
            var raw = event.dataTransfer.getData('text/plain');
            return raw ? JSON.parse(raw) : null;
        } catch (e) { return null; }
    }
    window.wfdPaletteDragStart = function (event) {
        var stepType = event.currentTarget.getAttribute('data-step-type');
        event.dataTransfer.setData('text/plain', JSON.stringify({ source: 'palette', stepType: stepType }));
        event.dataTransfer.effectAllowed = 'copy';
    };
    window.wfdNodeDragStart = function (event) {
        var stepId = event.currentTarget.getAttribute('data-step-id');
        event.dataTransfer.setData('text/plain', JSON.stringify({ source: 'node', stepId: stepId }));
        event.dataTransfer.effectAllowed = 'move';
        event.currentTarget.classList.add('wfd-dragging');
    };
    window.wfdNodeDragEnd = function (event) {
        event.currentTarget.classList.remove('wfd-dragging');
    };
    window.wfdNodeDragOver = function (event) {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.add('wfd-drop-target');
    };
    window.wfdNodeDragLeave = function (event) {
        event.currentTarget.classList.remove('wfd-drop-target');
    };
    window.wfdNodeDrop = function (event) {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.remove('wfd-drop-target');
        var payload = wfdParsePayload(event);
        if (!payload) return;
        var targetId = event.currentTarget.getAttribute('data-step-id');
        var targetIdx = wfDraftSteps.findIndex(function (x) { return x.id === targetId; });
        if (targetIdx < 0) return;
        var rect = event.currentTarget.getBoundingClientRect();
        var before = (event.clientY - rect.top) < (rect.height / 2);
        var insertIdx = before ? targetIdx : targetIdx + 1;

        if (payload.source === 'node') {
            var fromIdx = wfDraftSteps.findIndex(function (x) { return x.id === payload.stepId; });
            if (fromIdx < 0 || fromIdx === targetIdx) return;
            var moved = wfDraftSteps.splice(fromIdx, 1)[0];
            if (fromIdx < insertIdx) insertIdx--;
            wfDraftSteps.splice(insertIdx, 0, moved);
        } else if (payload.source === 'palette') {
            wfDraftSteps.splice(insertIdx, 0, { id: 'st_' + Date.now() + '_' + Math.floor(Math.random() * 1000), type: payload.stepType, detail: '' });
        }
        wfRenderStepsEditor();
    };
    window.wfdCanvasDragOver = function (event) {
        event.preventDefault();
    };
    window.wfdCanvasDrop = function (event) {
        // Only reached for drops on the canvas background, not on a node — node
        // drops call stopPropagation() so they never bubble up to here.
        event.preventDefault();
        var payload = wfdParsePayload(event);
        if (!payload) return;
        if (payload.source === 'palette') {
            wfDraftSteps.push({ id: 'st_' + Date.now() + '_' + Math.floor(Math.random() * 1000), type: payload.stepType, detail: '' });
        } else if (payload.source === 'node') {
            var fromIdx = wfDraftSteps.findIndex(function (x) { return x.id === payload.stepId; });
            if (fromIdx >= 0) wfDraftSteps.push(wfDraftSteps.splice(fromIdx, 1)[0]);
        }
        wfRenderStepsEditor();
    };

    // Creates a workflow directly (no editor/draft-step state involved) — used
    // by the Day Planner Agent. steps defaults to none; add them later in the
    // Workflow Builder's drag-and-drop designer. Returns the new id.
    function wfCreateWorkflow(name, trigger, steps) {
        var data = wfLoadData();
        var newId = 'wf_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        data.workflows.push({
            id: newId,
            name: name,
            trigger: WF_TRIGGERS.indexOf(trigger) !== -1 ? trigger : WF_TRIGGERS[0],
            active: true,
            steps: steps || []
        });
        wfSaveData(data);
        return newId;
    }
    window.wfSaveWorkflow = function () {
        var nameInput = document.getElementById('wfNameInput');
        var triggerInput = document.getElementById('wfTriggerInput');
        if (!nameInput) return;
        var name = nameInput.value.trim();
        if (!name) return;
        var data = wfLoadData();
        var savedSteps = wfDraftSteps.map(function (s) { return { id: s.id, type: s.type, detail: s.detail }; });
        if (wfEditingId) {
            var w = data.workflows.find(function (x) { return x.id === wfEditingId; });
            if (w) {
                w.name = name;
                w.trigger = triggerInput.value;
                w.steps = savedSteps;
            }
        } else {
            data.workflows.push({
                id: 'wf_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                name: name,
                trigger: triggerInput.value,
                active: true,
                steps: savedSteps
            });
        }
        wfSaveData(data);
        wfRenderList();
        closeWorkflowEditor();
    };

    /* ═══════════════════════════════════════
       DAY PLANNER AGENT
       A floating chat widget on the Day Planner page. This is a rule-based
       command interpreter, not an LLM — it matches a fixed set of phrasings
       against the same functions the UI itself calls (dpCreateTask,
       dpSetTaskStatus, dpDeleteTask, dpCreateTrackerItem, wfCreateWorkflow,
       wfToggleActive, ...), so anything it does is exactly what a click would
       have done. Unrecognized phrasing gets a "type help" fallback rather than
       a guess.
    ═══════════════════════════════════════ */
    var DP_AGENT_WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    var DP_AGENT_DATE_WORD = '(?:today|tomorrow|in \\d+ days?|\\d{4}-\\d{2}-\\d{2}|sunday|monday|tuesday|wednesday|thursday|friday|saturday)';

    function dpAgentFindTask(query) {
        var data = dpLoadData();
        var q = (query || '').trim().toLowerCase();
        if (!q) return null;
        var tasks = data.taskList || [];
        var exact = tasks.find(function (t) { return t.title.toLowerCase() === q; });
        if (exact) return exact;
        var partial = tasks.filter(function (t) {
            return t.title.toLowerCase().indexOf(q) !== -1 || q.indexOf(t.title.toLowerCase()) !== -1;
        });
        return partial.length ? partial[0] : null;
    }
    function dpAgentFindTrackerItem(query) {
        var data = dpLoadData();
        var q = (query || '').trim().toLowerCase();
        if (!q) return null;
        var items = data.tracker || [];
        var exact = items.find(function (t) { return t.title.toLowerCase() === q; });
        if (exact) return exact;
        var partial = items.filter(function (t) { return t.title.toLowerCase().indexOf(q) !== -1; });
        return partial.length ? partial[0] : null;
    }
    function dpAgentFindWorkflow(query) {
        var data = wfLoadData();
        var q = (query || '').trim().toLowerCase();
        if (!q) return null;
        var items = data.workflows || [];
        var exact = items.find(function (w) { return w.name.toLowerCase() === q; });
        if (exact) return exact;
        var partial = items.filter(function (w) { return w.name.toLowerCase().indexOf(q) !== -1; });
        return partial.length ? partial[0] : null;
    }

    // Resolves "today" / "tomorrow" / a weekday name / "in N days" / a literal
    // YYYY-MM-DD to a dateKey. Returns null for anything unrecognized.
    function dpAgentParseDate(phrase) {
        if (!phrase) return null;
        var p = phrase.trim().toLowerCase();
        if (/^\d{4}-\d{2}-\d{2}$/.test(p)) return p;
        var today = new Date();
        if (p === 'today') return dpToDateKey(today);
        if (p === 'tomorrow') { var d = new Date(today); d.setDate(d.getDate() + 1); return dpToDateKey(d); }
        var inDays = p.match(/^in\s+(\d+)\s+days?$/);
        if (inDays) { var d2 = new Date(today); d2.setDate(d2.getDate() + parseInt(inDays[1], 10)); return dpToDateKey(d2); }
        var wIdx = DP_AGENT_WEEKDAYS.indexOf(p);
        if (wIdx !== -1) {
            var d3 = new Date(today);
            var delta = (wIdx - d3.getDay() + 7) % 7;
            if (delta === 0) delta = 7; // a weekday name always means the NEXT one, even if today matches
            d3.setDate(d3.getDate() + delta);
            return dpToDateKey(d3);
        }
        return null;
    }

    // Matches a status name against the built-ins/existing customs case-
    // insensitively; if it's genuinely new, registers it exactly like the
    // "+ Add new status…" dropdown option does, so it's usable everywhere after.
    function dpAgentResolveStatus(raw) {
        var data = dpLoadData();
        var known = DP_TASK_STATUSES.concat(data.customTaskStatuses || []);
        var match = known.find(function (s) { return s.toLowerCase() === raw.toLowerCase(); });
        if (match) return match;
        if (!data.customTaskStatuses) data.customTaskStatuses = [];
        data.customTaskStatuses.push(raw);
        dpSaveData(data);
        return raw;
    }

    function dpAgentHelpText() {
        return 'Here’s what I can do:\n' +
            '• Add a task to call the vendor tomorrow\n' +
            '• Close the client follow-up task\n' +
            '• Set the client follow-up task to In Dev\n' +
            '• Delete the task old draft\n' +
            '• Set expected closure of client follow-up to 3 days\n' +
            '• Track design review for Engineering due friday\n' +
            '• Create a workflow named Auto Follow-up when Task Closed\n' +
            '• Activate / Pause / Delete the workflow Auto Follow-up\n' +
            '• Go to today / next week / last week / friday\n' +
            '• What are my tasks today? / How many tasks are open? / List workflows';
    }

    var DP_AGENT_RULES = [
        // ── Add task ──────────────────────────────────────────────────────
        {
            re: new RegExp('^(?:add|create|new)\\s+(?:a\\s+)?task(?:\\s+(?:to|called|named|titled))?\\s+["“]?(.+?)["”]?(?:\\s+(?:for\\s+|on\\s+)?(' + DP_AGENT_DATE_WORD + '))?$', 'i'),
            run: function (m) {
                var title = m[1].trim();
                var dateKey = dpAgentParseDate(m[2]) || dpSelectedDate;
                dpCreateTask({ title: title, startDate: dateKey });
                return 'Added "' + title + '" to My Day for ' + dpFormatDate(dateKey) + '.';
            }
        },
        {
            re: new RegExp('^remind me to\\s+(.+?)(?:\\s+(?:for\\s+|on\\s+)?(' + DP_AGENT_DATE_WORD + '))?$', 'i'),
            run: function (m) {
                var title = m[1].trim();
                var dateKey = dpAgentParseDate(m[2]) || dpSelectedDate;
                dpCreateTask({ title: title, startDate: dateKey });
                return 'Added "' + title + '" to My Day for ' + dpFormatDate(dateKey) + '.';
            }
        },
        // ── Close task ────────────────────────────────────────────────────
        {
            re: /^(?:close|complete|finish)\s+(?:the\s+)?(?:task\s+)?["“]?(.+?)["”]?$/i,
            run: function (m) {
                var t = dpAgentFindTask(m[1]);
                if (!t) return 'I couldn’t find a task matching "' + m[1] + '".';
                dpSetTaskState(t.id, 'Closed', dpToDateKey(new Date()));
                return 'Closed "' + t.title + '".';
            }
        },
        // ── Expected closure (checked before the generic "set X to Y" status
        // rule below, since "set expected closure of X to N days" would
        // otherwise match that broader pattern first) ──────────────────────
        {
            re: /^set\s+(?:the\s+)?expected\s+closure\s+(?:of|for)\s+["“]?(.+?)["”]?\s+(?:to|in)\s+(\d+)\s+days?$/i,
            run: function (m) {
                var t = dpAgentFindTask(m[1]);
                if (!t) return 'I couldn’t find a task matching "' + m[1] + '".';
                var d = new Date();
                d.setDate(d.getDate() + parseInt(m[2], 10));
                dpSetTaskDate(t.id, 'expectedCloseDate', dpToDateKey(d));
                return 'Set expected closure for "' + t.title + '" to ' + dpFormatDate(dpToDateKey(d)) + '.';
            }
        },
        // ── Set status ────────────────────────────────────────────────────
        {
            re: /^(?:set|change|move|mark)\s+(?:the\s+)?(?:task\s+)?["“]?(.+?)["”]?\s+(?:status\s+)?to\s+["“]?(.+?)["”]?$/i,
            run: function (m) {
                var t = dpAgentFindTask(m[1]);
                if (!t) return 'I couldn’t find a task matching "' + m[1] + '".';
                var status = dpAgentResolveStatus(m[2].trim());
                dpSetTaskStatus(t.id, status);
                return 'Set "' + t.title + '" to "' + status + '".';
            }
        },
        // ── Delete task ───────────────────────────────────────────────────
        {
            re: /^(?:delete|remove)\s+(?:the\s+)?task\s+["“]?(.+?)["”]?$/i,
            run: function (m) {
                var t = dpAgentFindTask(m[1]);
                if (!t) return 'I couldn’t find a task matching "' + m[1] + '".';
                dpDeleteTask(t.id);
                return 'Deleted "' + t.title + '".';
            }
        },
        // ── Navigation ────────────────────────────────────────────────────
        { re: /^(?:go to|show|jump to)\s+today$/i, run: function () { dpGoToday(); return 'Jumped to today.'; } },
        { re: /^(?:go to|show)\s+next week$/i, run: function () { dpShiftWeek(1); return 'Showing next week.'; } },
        { re: /^(?:go to|show)\s+(?:last|previous)\s+week$/i, run: function () { dpShiftWeek(-1); return 'Showing last week.'; } },
        {
            re: /^(?:show|go to)\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)$/i,
            run: function (m) {
                var key = dpAgentParseDate(m[1]);
                dpSelectDate(key);
                return 'Showing ' + dpFormatDate(key) + '.';
            }
        },
        // ── Team Tracker ──────────────────────────────────────────────────
        {
            re: new RegExp('^track\\s+(?:a\\s+)?(?:task\\s+)?["“]?(.+?)["”]?\\s+for\\s+(?:team\\s+)?([^,]+?)(?:\\s+due\\s+(' + DP_AGENT_DATE_WORD + '))?$', 'i'),
            run: function (m) {
                var due = dpAgentParseDate(m[3]) || '';
                var title = m[1].trim(), team = m[2].trim();
                dpCreateTrackerItem({ title: title, team: team, dueDate: due });
                return 'Tracking "' + title + '" for ' + team + (due ? ' (due ' + dpFormatDate(due) + ')' : '') + '.';
            }
        },
        // ── Workflows ─────────────────────────────────────────────────────
        {
            re: /^create\s+(?:a\s+)?workflow\s+(?:named\s+|called\s+)?["“]?(.+?)["”]?\s+(?:triggered by|when|on)\s+(.+)$/i,
            run: function (m) {
                var triggerRaw = m[2].trim().toLowerCase();
                var trigger = WF_TRIGGERS.find(function (t) { return t.toLowerCase() === triggerRaw; }) || WF_TRIGGERS[0];
                var name = m[1].trim();
                wfCreateWorkflow(name, trigger, []);
                return 'Created workflow "' + name + '" (trigger: ' + trigger + '). Add steps for it in the Workflow Builder.';
            }
        },
        {
            re: /^(?:activate|enable|turn on|resume)\s+(?:the\s+)?workflow\s+["“]?(.+?)["”]?$/i,
            run: function (m) {
                var w = dpAgentFindWorkflow(m[1]);
                if (!w) return 'I couldn’t find a workflow matching "' + m[1] + '".';
                if (!w.active) wfToggleActive(w.id);
                return '"' + w.name + '" is now active.';
            }
        },
        {
            re: /^(?:pause|disable|deactivate|turn off)\s+(?:the\s+)?workflow\s+["“]?(.+?)["”]?$/i,
            run: function (m) {
                var w = dpAgentFindWorkflow(m[1]);
                if (!w) return 'I couldn’t find a workflow matching "' + m[1] + '".';
                if (w.active) wfToggleActive(w.id);
                return '"' + w.name + '" is now paused.';
            }
        },
        {
            re: /^delete\s+(?:the\s+)?workflow\s+["“]?(.+?)["”]?$/i,
            run: function (m) {
                var w = dpAgentFindWorkflow(m[1]);
                if (!w) return 'I couldn’t find a workflow matching "' + m[1] + '".';
                wfDeleteWorkflow(w.id);
                return 'Deleted workflow "' + w.name + '".';
            }
        },
        {
            re: /^(?:list|show)\s+workflows$/i,
            run: function () {
                var data = wfLoadData();
                if (!data.workflows.length) return 'No workflows yet.';
                return data.workflows.map(function (w) {
                    return '• ' + w.name + ' — ' + (w.active ? 'Active' : 'Paused') + ' (' + w.trigger + ')';
                }).join('\n');
            }
        },
        // ── Queries ───────────────────────────────────────────────────────
        {
            re: /^(?:what are|show|list)\s+my\s+tasks(?:\s+today)?\??$/i,
            run: function () {
                var data = dpLoadData();
                var todayKey = dpToDateKey(new Date());
                var tasks = dpVisibleTasksForDate(data, todayKey).filter(function (t) { return t.status === 'Me'; });
                if (!tasks.length) return 'No personal tasks for today.';
                return tasks.map(function (t) { return '• "' + t.title + '" (' + t.status + ')'; }).join('\n');
            }
        },
        {
            re: /^(?:how many|count)\s+(?:open\s+)?tasks(?:\s+are\s+open)?\??$/i,
            run: function () {
                var data = dpLoadData();
                var todayKey = dpToDateKey(new Date());
                var tasks = dpVisibleTasksForDate(data, todayKey);
                var open = tasks.filter(function (t) { return t.taskState !== 'Closed'; }).length;
                return tasks.length + ' task(s) visible today, ' + open + ' still open.';
            }
        },
        { re: /^help\??$/i, run: function () { return dpAgentHelpText(); } }
    ];

    // Tries each rule in order and runs the first one whose pattern matches the
    // whole (trailing-punctuation-stripped) input.
    function dpAgentProcess(text) {
        var input = (text || '').trim();
        if (!input) return '';
        var stripped = input.replace(/[.!]+$/, '');
        for (var i = 0; i < DP_AGENT_RULES.length; i++) {
            var m = stripped.match(DP_AGENT_RULES[i].re);
            if (m) {
                try { return DP_AGENT_RULES[i].run(m); }
                catch (e) { return 'Something went wrong running that — try rephrasing.'; }
            }
        }
        return 'I didn’t catch that. Type "help" to see what I can do.';
    }

    window.toggleDpAgent = function () {
        var panel = document.getElementById('dpAgentPanel');
        if (!panel) return;
        var isOpen = panel.style.display !== 'none';
        if (isOpen) { panel.style.display = 'none'; return; }
        panel.style.display = 'flex';
        var messages = document.getElementById('dpAgentMessages');
        if (messages && !messages.children.length) {
            dpAgentAppendMessage('agent', 'Hi! I can add/close/update tasks, track team work, and manage workflows for you. Type "help" for examples.');
        }
        setTimeout(function () {
            var input = document.getElementById('dpAgentInput');
            if (input) input.focus();
        }, 50);
    };
    function dpAgentAppendMessage(role, text) {
        var list = document.getElementById('dpAgentMessages');
        if (!list) return;
        var row = document.createElement('div');
        row.className = 'dp-agent-msg dp-agent-msg-' + role;
        row.textContent = text;
        list.appendChild(row);
        list.scrollTop = list.scrollHeight;
        return row;
    }
    function dpAgentSetTyping(on) {
        var existing = document.getElementById('dpAgentTyping');
        if (existing) existing.remove();
        if (!on) return;
        var row = dpAgentAppendMessage('agent', '…');
        if (row) row.id = 'dpAgentTyping';
    }

    /* ── LLM mode (DeepSeek, via the backend proxy at /api/agent/chat) ──────
       Tool *execution* stays client-side — the LLM only decides which tool to
       call; DP_AGENT_TOOL_HANDLERS below runs the same functions the UI uses.
       Falls back to the rule-based dpAgentProcess() if no API key is
       configured server-side, so the agent still works either way. */
    var dpAgentHistory = [];
    var dpAgentLLMUnavailable = false; // set once "not_configured" is seen, to stop retrying every turn
    var DP_AGENT_MAX_TURNS = 5;

    function dpAgentBuildContext() {
        var dpData = dpLoadData();
        var wfData = wfLoadData();
        return {
            today: dpToDateKey(new Date()),
            tasks: (dpData.taskList || []).map(function (t) {
                return { id: t.id, title: t.title, status: t.status, state: t.taskState, startDate: t.startDate, expectedCloseDate: t.expectedCloseDate, closedDate: t.closedDate };
            }),
            tracker: (dpData.tracker || []).map(function (t) {
                return { id: t.id, title: t.title, team: t.team, status: t.status, dueDate: t.dueDate };
            }),
            customStatuses: dpData.customTaskStatuses || [],
            workflows: (wfData.workflows || []).map(function (w) {
                return { id: w.id, name: w.name, trigger: w.trigger, active: w.active, stepCount: (w.steps || []).length };
            })
        };
    }

    var DP_AGENT_TOOL_HANDLERS = {
        add_task: function (args) {
            var id = dpCreateTask({ title: args.title, description: args.description || '', startDate: args.date || dpSelectedDate, status: args.status || 'Me' });
            return { ok: true, task_id: id };
        },
        set_task_status: function (args) {
            var data = dpLoadData();
            var t = data.taskList.find(function (x) { return x.id === args.task_id; });
            if (!t) return { ok: false, error: 'task not found' };
            var status = dpAgentResolveStatus(String(args.status || ''));
            dpSetTaskStatus(t.id, status);
            return { ok: true };
        },
        set_task_state: function (args) {
            var data = dpLoadData();
            var t = data.taskList.find(function (x) { return x.id === args.task_id; });
            if (!t) return { ok: false, error: 'task not found' };
            var state = DP_TASK_STATE_VALUES.indexOf(args.state) !== -1 ? args.state : 'Open';
            dpSetTaskState(t.id, state, dpToDateKey(new Date()));
            return { ok: true };
        },
        delete_task: function (args) {
            var data = dpLoadData();
            var t = data.taskList.find(function (x) { return x.id === args.task_id; });
            if (!t) return { ok: false, error: 'task not found' };
            dpDeleteTask(t.id);
            return { ok: true };
        },
        set_expected_closure: function (args) {
            var data = dpLoadData();
            var t = data.taskList.find(function (x) { return x.id === args.task_id; });
            if (!t) return { ok: false, error: 'task not found' };
            dpSetTaskDate(t.id, 'expectedCloseDate', args.date);
            return { ok: true };
        },
        add_tracker_item: function (args) {
            var id = dpCreateTrackerItem({ title: args.title, team: args.team, dueDate: args.due_date || '', notes: args.notes || '' });
            return { ok: true, tracker_id: id };
        },
        create_workflow: function (args) {
            var id = wfCreateWorkflow(args.name, args.trigger, []);
            return { ok: true, workflow_id: id };
        },
        toggle_workflow: function (args) {
            var data = wfLoadData();
            var w = data.workflows.find(function (x) { return x.id === args.workflow_id; });
            if (!w) return { ok: false, error: 'workflow not found' };
            if (w.active !== !!args.active) wfToggleActive(w.id);
            return { ok: true };
        },
        delete_workflow: function (args) {
            var data = wfLoadData();
            var w = data.workflows.find(function (x) { return x.id === args.workflow_id; });
            if (!w) return { ok: false, error: 'workflow not found' };
            wfDeleteWorkflow(w.id);
            return { ok: true };
        },
        navigate_date: function (args) {
            var key = (args.date === 'today') ? dpToDateKey(new Date()) : args.date;
            dpSelectDate(key);
            return { ok: true };
        }
    };

    function dpAgentCallLLM(messages) {
        return fetch(API_BASE + '/api/agent/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: messages, context: dpAgentBuildContext() })
        }).then(function (r) { return r.json(); });
    }

    function dpAgentStepLLM(turn) {
        if (turn >= DP_AGENT_MAX_TURNS) {
            dpAgentSetTyping(false);
            dpAgentAppendMessage('agent', 'I hit my step limit working on that — try breaking it into smaller requests.');
            return;
        }
        return dpAgentCallLLM(dpAgentHistory).then(function (res) {
            if (!res || !res.ok) {
                dpAgentSetTyping(false);
                if (res && res.code === 'not_configured') {
                    dpAgentLLMUnavailable = true;
                    dpAgentHistory.pop(); // drop the user turn we just queued for the LLM
                    dpAgentAppendMessage('agent', 'The AI agent isn’t configured yet (no DeepSeek API key on the backend) — falling back to basic command mode.');
                    dpAgentAppendMessage('agent', dpAgentProcess(dpAgentLastUserText));
                    return;
                }
                dpAgentAppendMessage('agent', (res && res.error) || 'The AI agent is unavailable right now.');
                return;
            }
            var msg = res.message || {};
            dpAgentHistory.push({ role: 'assistant', content: msg.content || null, tool_calls: msg.tool_calls });
            if (msg.tool_calls && msg.tool_calls.length) {
                msg.tool_calls.forEach(function (call) {
                    var handler = DP_AGENT_TOOL_HANDLERS[call.function.name];
                    var args = {};
                    try { args = JSON.parse(call.function.arguments || '{}'); } catch (e) {}
                    var result;
                    try { result = handler ? handler(args) : { ok: false, error: 'unknown tool' }; }
                    catch (e) { result = { ok: false, error: e.message }; }
                    dpAgentHistory.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(result) });
                });
                return dpAgentStepLLM(turn + 1);
            }
            dpAgentSetTyping(false);
            dpAgentAppendMessage('agent', msg.content || '(no response)');
        }).catch(function (e) {
            dpAgentSetTyping(false);
            dpAgentAppendMessage('agent', 'Couldn’t reach the AI agent — check your connection.');
        });
    }

    var dpAgentLastUserText = '';
    window.dpAgentSend = function () {
        var input = document.getElementById('dpAgentInput');
        if (!input) return;
        var text = input.value.trim();
        if (!text) return;
        dpAgentAppendMessage('user', text);
        input.value = '';
        dpAgentLastUserText = text;
        if (dpAgentLLMUnavailable) {
            dpAgentAppendMessage('agent', dpAgentProcess(text));
            return;
        }
        dpAgentHistory.push({ role: 'user', content: text });
        dpAgentSetTyping(true);
        dpAgentStepLLM(0);
    };
    window.dpAgentQuickCommand = function (text) {
        var input = document.getElementById('dpAgentInput');
        if (input) input.value = text;
        dpAgentSend();
    };
