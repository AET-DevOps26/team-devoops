"""Test setup shared across the suite.

Importing ``app`` pulls in ``service``, which at import time builds an LLM agent (a real OpenAI
call). Tests stub ``service`` out before ``app`` is imported, and neutralise the startup DB
initialisation so no live database is required.
"""

import sys
import types

import db

# Stub the heavy LLM service module so importing `app` doesn't trigger model/embedding setup.
_service_stub = types.ModuleType("service")
_service_stub.hello = lambda: "stub"
sys.modules.setdefault("service", _service_stub)

# `app` calls db.init_db() at import; there is no database in the test environment.
db.init_db = lambda: None
